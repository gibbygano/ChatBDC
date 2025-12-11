import { Pool } from "pg";
import { getAppConfig } from "@/config.ts";

class PoolProvider {
  private static instance: PoolProvider;
  pool: Pool;

  private constructor() {
    const { is_development } = getAppConfig();

    this.pool = new Pool({
      ssl: is_development
        ? false
        : { rejectUnauthorized: false /* intra-cluster fuckery*/ },
    });
  }

  static get pool(): Pool {
    if (!PoolProvider.instance) {
      PoolProvider.instance = new PoolProvider();
    }

    return PoolProvider.instance.pool;
  }
}

export { PoolProvider };
