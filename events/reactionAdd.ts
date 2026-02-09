import type { MessageReaction, User } from "discord.js";

import { Events } from "discord.js";
import logger from "@logging";

export default {
  name: Events.MessageReactionAdd,
  execute: async (reaction: MessageReaction, user: User) => {
    if (reaction.emoji.name === "twerk") {
      logger.log_info(
        "Nuking stupid emoji that I hate so much",
        JSON.stringify(user, null, 3),
        JSON.stringify(reaction.emoji, null, 3),
      );

      try {
        await reaction.remove();
      } catch (error) {
        logger.log_error(
          "Could not remove reaction",
          error,
          JSON.stringify(reaction, null, 3),
        );
      }
    }
  },
};
