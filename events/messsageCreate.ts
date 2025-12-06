import type { Message } from "discord.js";
import { Events } from "discord.js";
import mediaService from "@/services/mediaService.ts";

export default {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    const voice_channel = message.member?.voice.channel;

    if (message.content.startsWith("!")) {
      await mediaService.playMedia(
        message,
        voice_channel,
        message.content.substring(1),
        true,
      );
    }
  },
};
