import type { GuildMember } from "discord.js";
import logger from "@logging";
import { Events } from "discord.js";
import { UserRepository } from "@repositories";
import { PoolProvider } from "@/infrastructure/poolProvider.ts";

export default {
  name: Events.GuildMemberAdd,
  execute: async (member: GuildMember) => {
    // Don't interact with bots
    if (member?.user.bot || !member?.user.id) {
      return;
    }

    // Ensure user exists in DB
    const user_repository = new UserRepository(PoolProvider.instance);
    logger.log_info(
      "registering new user",
      JSON.stringify(member.user, null, 3),
    );
    await user_repository.upsertUser(member.user);
  },
};
