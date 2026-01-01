import type { Message } from "discord.js";

import { Events } from "discord.js";
import { MediaService } from "@services";
import { MessageRepository } from "@repositories";
import { PoolProvider } from "@/infrastructure/poolProvider.ts";

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    // Don't interact with bots
    if (message.member?.user.bot) {
      return;
    }

    const message_repository = new MessageRepository(PoolProvider.instance);
    // Log message to pg sync
    message_repository
      .insertMessage(message)
      .catch((e) =>
        console.error(
          `Inserting message ${message.id} for user ${message.member?.user.id} failed.`,
          e,
        )
      );

    if (message.content.startsWith("!")) {
      const voice_channel = message.member?.voice.channel;
      const media_service = MediaService.instance;

      await media_service.playMedia(
        message,
        voice_channel,
        message.content.substring(1).toLowerCase(),
        true,
      );
    }
  },
};
