import type { PoolClient } from "pg";
import { Pool } from "pg";
import { getAppConfig } from "@/config.ts";

class CommandsRepository {
  private pool: Pool;

  constructor() {
    const { is_development } = getAppConfig();

    this.pool = new Pool({
      ssl: is_development
        ? false
        : { rejectUnauthorized: false /* intra-cluster fuckery*/ },
    });
  }

  getCommands = async <T>(context: string, command_name: string) => {
    let client: PoolClient | undefined;

    try {
      client = await this.pool.connect();

      const result = await client.query(
        "SELECT commands->$2 as gimmecarl FROM commands WHERE context = $1",
        [context, command_name],
      );

      return <T> result.rows[0];
    } catch (e) {
      console.error(e);
    } finally {
      if (client) {
        client.release();
      }
    }
  };
}

const instance = new CommandsRepository();

export default instance;
