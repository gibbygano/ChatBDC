import type { Media, MediaDirectory, Reminder } from "@/types.ts";

import { QueueType } from "@/types.ts";
import { join } from "@std/path/join";
import { walk } from "@std/fs/walk";
import { Client, TextChannel } from "discord.js";
import logger from "@logging";
import { QueueService, ReminderService } from "@services";
import { now, remaining } from "./time.ts";
import { notify } from "./rollcall.ts";

const register = async <T>(
  directory: string,
  callback: (registrationEntity: T) => void,
) => {
  const foldersPath = join(Deno.cwd(), directory);
  for await (const dirEntry of walk(foldersPath)) {
    if (dirEntry.isFile && dirEntry.name.endsWith(".ts")) {
      const entity = (await import(dirEntry.path)).default;
      callback(entity);
    }
  }
};

const registerMedia = async (
  directory: string,
  callback: (media: Media) => void,
) => {
  const foldersPath = join(Deno.cwd(), directory);

  for await (const dirEntry of walk(foldersPath)) {
    if (dirEntry.isFile) {
      const path_from_directory = dirEntry.path.split(directory)[1];
      const name = dirEntry.path.split("/").slice(-2, -1)[0];
      const media_directory: MediaDirectory = {
        name,
        search_string: name.toLowerCase(),
        path: dirEntry.path.substring(0, dirEntry.path.lastIndexOf("/")),
        pathLabel: path_from_directory.substring(
          0,
          path_from_directory.lastIndexOf("/"),
        ) || "/",
      };

      const short_name = dirEntry.name.split(".")[0];
      callback({
        short_name,
        full_name: dirEntry.name,
        path: dirEntry.path,
        directory: media_directory,
        search_string: short_name.toLowerCase(),
      });
    }
  }
};

const registerQueueListeners = async (client: Client) => {
  const queue_service = QueueService.instance;

  // Register reminder queue listener
  await queue_service.registerListener<Reminder>(
    QueueType.Reminder,
    async (id: string) => {
      logger.log_info(`Processing queue item`, id);
      let remaining_time: { minutes: number; seconds: number } | undefined;

      const reminder_service = ReminderService.instance;
      const reminder = reminder_service.getReminder(id);
      const at_time = reminder!.end_timestamp <= now();
      const channel = client.channels.cache.get(reminder!.request.channel_id);

      if (at_time) {
        reminder_service.deleteReminder(id);
      } else {
        remaining_time = remaining(reminder!.end_timestamp);
        reminder_service.enqueue(remaining_time!.minutes, id);
      }

      if (channel instanceof TextChannel) {
        await notify(channel, at_time, reminder, remaining_time);
      }
    },
  );
};

export { register, registerMedia, registerQueueListeners };
