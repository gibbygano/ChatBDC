import type { GuildManager } from "discord.js";
import { BaseRepository } from "./baseRepository.ts";

class GuildRepository extends BaseRepository {
  constructor() {
    super();
  }

  registerGuilds = async (guilds: GuildManager) => {
    const register = async (guild_id: string, guild_name: string) => {
      const prepared_statement = {
        name: "register-guild",
        text:
          "INSERT INTO guild (guild_id, guild_name) VALUES($1, $2) ON CONFLICT ON CONSTRAINT guild_pkey DO NOTHING;",
        values: [guild_id, guild_name],
      };

      const result = await this.queryWithSuccess(prepared_statement);

      if (result) {
        console.info(`> Registered guild ${guild_id}:${guild_name}`);
      }
    };

    console.info(
      "\nLooking for guilds to register.\n---------------------------------------------",
    );

    for (const guild of guilds.cache.values()) {
      const full_guild = await guilds.cache.get(guild.id)?.fetch();

      if (full_guild) {
        await register(full_guild.id, full_guild.name);
      }
    }

    console.info("---------------------------------------------\n");
  };
}

const instance = new GuildRepository();

export default instance;
