import type { IGuildRepository } from "@repositories";
import type { GuildManager } from "discord.js";

export interface IGuildService {
  registerGuilds(guild_manager: GuildManager): Promise<void>;
}

export class GuildService implements GuildService {
  private _guild_repository: IGuildRepository;

  constructor(guild_repository: IGuildRepository) {
    this._guild_repository = guild_repository;
  }

  async registerGuilds(guild_manager: GuildManager) {
    for (const guild of guild_manager.cache.values()) {
      const full_guild = await guild_manager.cache.get(guild.id)?.fetch();

      if (full_guild) {
        await this._guild_repository.registerGuild(full_guild);
      }
    }
  }
}
