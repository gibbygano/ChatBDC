import { Events, Message } from "discord.js";
import commandService from "@/services/commandService.ts";

export default {
  name: Events.MessageCreate,
  async execute(message: Message) {
    if (!message.content.startsWith("!")) {
      return;
    }

    const media_command = commandService.commands.get("audio");

    try {
      await media_command?.execute(message);
    } catch (error) {
      console.error(error);
    }
  },
};
