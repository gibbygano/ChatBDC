import type { IPoolProvider } from "@/infrastructure/poolProvider.ts";
import type { Guild } from "discord.js";

import { BaseRepository } from "./baseRepository.ts";

export interface IGuildRepository {
  registerGuild(guild: Guild): Promise<boolean>;
}

export class GuildRepository extends BaseRepository
  implements IGuildRepository {
  constructor(poolProvider: IPoolProvider) {
    super(poolProvider);
  }

  async registerGuild(guild: Guild) {
    const prepared_statement = {
      name: "register-guild",
      text: `INSERT INTO guild (guild_id, guild_name) 
             VALUES($1, $2) 
             ON CONFLICT ON CONSTRAINT guild_pkey 
             DO NOTHING`,
      values: [guild.id, guild.name],
    };

    return await this.queryWithSuccess(prepared_statement);
  }
}
