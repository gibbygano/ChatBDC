import type { IUserRepository } from "@repositories";
import type { GuildManager } from "discord.js";

export interface IUserService {
  registerUsers(guilds: GuildManager): Promise<void>;
}

export class UserService implements IUserService {
  private _user_repository: IUserRepository;

  constructor(user_repository: IUserRepository) {
    this._user_repository = user_repository;
  }

  async registerUsers(guilds: GuildManager): Promise<void> {
    for (const guild of guilds.cache.values()) {
      const members = (await guild.members.fetch()).values();

      for (const member of members) {
        await this._user_repository.upsertUser(member.user);
      }
    }
  }
}
