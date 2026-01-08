import type { IGuildRepository } from "@repositories";
import type { GuildManager } from "discord.js";

export interface IGuildService {
  registerGuilds(guild_manager: GuildManager): Promise<void>;
}

export class GuildService implements GuildService {
  constructor(private readonly guild_repository: IGuildRepository) {}

  async registerGuilds(guild_manager: GuildManager) {
    for (const guild of guild_manager.cache.values()) {
      const full_guild = await guild_manager.cache.get(guild.id)?.fetch();

      if (full_guild) {
        await this.guild_repository.registerGuild(full_guild);
      }
    }
  }
}
