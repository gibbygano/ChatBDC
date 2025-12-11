import type { Message } from "discord.js";
import { Events } from "discord.js";
import { MediaService } from "@/services/mediaService.ts";

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    const voice_channel = message.member?.voice.channel;
    const media_service = MediaService.instance;

    if (message.content.startsWith("!")) {
      await media_service.playMedia(
        message,
        voice_channel,
        message.content.substring(1),
        true,
      );
    }
  },
};
