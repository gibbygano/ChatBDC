import type { Media, MediaDirectory, Reminder } from "@/types.ts";

import { QueueType } from "@/types.ts";
import { join } from "@std/path/join";
import { walk } from "@std/fs/walk";
import {
  Client,
  ContainerBuilder,
  MessageFlags,
  TextChannel,
  TextDisplayBuilder,
} from "discord.js";
import { QueueService } from "@/services/queueService.ts";
import { ReminderService } from "@/services/reminderService.ts";
import { now, remaining, remaining_to_string } from "./time.ts";

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
      const media_directory: MediaDirectory = {
        name: dirEntry.path.split("/").slice(-2, -1)[0],
        path: dirEntry.path.substring(0, dirEntry.path.lastIndexOf("/")),
        pathLabel: path_from_directory.substring(
          0,
          path_from_directory.lastIndexOf("/"),
        ) || "/",
      };

      callback({
        short_name: dirEntry.name.split(".")[0],
        full_name: dirEntry.name,
        path: dirEntry.path,
        directory: media_directory,
      });
    }
  }
};

const registerQueueListeners = async (client: Client) => {
  const queue_service = QueueService.instance;

  // Register reminder queue listener
  await queue_service.registerListener<Reminder>(
    QueueType.Reminder,
    async (reminder: Reminder, id: string) => {
      console.info(`Processing queue item ${id}`);

      const at_time = reminder.end_timestamp <= now();
      let remaining_time: { minutes: number; seconds: number } | undefined;
      const channel = client.channels.cache.get(reminder.channel_id);

      const reminder_service = ReminderService.instance;
      if (at_time) {
        reminder_service.deleteReminder(id);
      } else {
        remaining_time = remaining(reminder.end_timestamp);
        reminder.timespan_in_minutes = remaining_time!.minutes;

        reminder_service.enqueue(reminder, id);

        console.info(
          `Re-queued item ${id} for ${
            reminder.timespan_in_minutes > 5 ? 5 : remaining
          }`,
        );
      }

      if (channel instanceof TextChannel) {
        const dota_reminder_display = new ContainerBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(
                `${
                  [
                    ...reminder.members.values().map((m) =>
                      `## <@${m.user.id}>`
                    ),
                  ]
                    .join(
                      " ",
                    )
                }`,
              ),
          ).addSeparatorComponents((separator) => separator)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `# ${reminder.reminder_type} ${
                at_time
                  ? "time!"
                  : `in **${remaining_to_string(remaining_time!)}**.`
              }`,
            ),
          );

        await channel.send({
          components: [dota_reminder_display],
          flags: MessageFlags.IsComponentsV2,
        });
      }
    },
  );
};

export { register, registerMedia, registerQueueListeners };
