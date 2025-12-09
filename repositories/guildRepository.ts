import type { GuildManager } from "discord.js";
import type { PoolClient } from "pg";
import { Pool } from "pg";

class GuildRepository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool();
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

        console.info(`Registered ${result.rowCount} guilds.`);
      } catch (e) {
        console.error(e);
      } finally {
        if (client) {
          client.release();
        }
      }
    };

    for (const guild of guilds.cache.values()) {
      const full_guild = await guilds.cache.get(guild.id)?.fetch();

      if (full_guild) {
        await register(full_guild.id, full_guild.name);
      }
    }
  };
}

const instance = new GuildRepository();

export default instance;
