import type { Message } from "discord.js";

import { Events } from "discord.js";
import logger from "@logging";
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
        logger.log_error(
          "Inserting message failed",
          JSON.stringify({
            message_id: message.id,
            user_id: message.member?.user.id,
          }),
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
