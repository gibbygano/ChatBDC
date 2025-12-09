import type { GuildManager } from "discord.js";
import type { PoolClient } from "pg";
import { Pool } from "pg";

class GuildRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      ssl: { rejectUnauthorized: false /* intra-cluster fuckery*/ },
    });
  }

  registerGuilds = async (guilds: GuildManager) => {
    const register = async (guild_id: string, guild_name: string) => {
      let client: PoolClient | undefined;

      try {
        client = await this.pool.connect();

        const result = await client.query(
          "INSERT INTO guild (guild_id, guild_name) VALUES($1, $2) ON CONFLICT ON CONSTRAINT guild_pkey DO NOTHING;",
          [guild_id, guild_name],
        );

        if (result.rowCount) {
          console.info(`> Registered guild ${guild_id}:${guild_name}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (client) {
          client.release();
        }
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
