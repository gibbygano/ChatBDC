import type { IUserRepository } from "@repositories";
import type { GuildManager } from "discord.js";

export interface IUserService {
  registerUsers(guilds: GuildManager): Promise<void>;
}

export class UserService implements IUserService {
  constructor(private readonly user_repository: IUserRepository) {}

  async registerUsers(guilds: GuildManager): Promise<void> {
    for (const guild of guilds.cache.values()) {
      const members = (await guild.members.fetch()).values();

      for (const member of members) {
        await this.user_repository.upsertUser(member.user);
      }
    }
  }
}
