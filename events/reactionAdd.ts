import type { MessageReaction } from "discord.js";

import { Events } from "discord.js";
import logger from "@logging";

export default {
  name: Events.MessageReactionAdd,
  execute: (reaction: MessageReaction) => {
    logger.log_info(JSON.stringify(reaction.emoji, null, 3));
  },
};
