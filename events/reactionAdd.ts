import type { Message, MessageReaction } from "discord.js";

import { Events } from "discord.js";
import logger from "@logging";

export default {
  name: Events.MessageReactionAdd,
  execute: async (reaction: MessageReaction, message: Message) => {
    if (reaction.emoji.name === "twerk") {
      await message.delete();

      logger.log_info(
        "Nuking stupid emoji that I hate so much",
        JSON.stringify(message.member?.user, null, 3),
        JSON.stringify(reaction.emoji, null, 3),
      );
    }
  },
};
