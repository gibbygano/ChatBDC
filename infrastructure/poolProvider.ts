import { Pool } from "pg";
import { getAppConfig } from "@/config.ts";

export interface IPoolProvider {
  get pool(): Pool;
}

export class PoolProvider implements IPoolProvider {
  private static _instance: PoolProvider;
  private _pool: Pool;

  private constructor() {
    const { is_development } = getAppConfig();

    this._pool = new Pool({
      ssl: is_development
        ? false
        : { rejectUnauthorized: false /* intra-cluster fuckery*/ },
    });
  }

  static get instance(): PoolProvider {
    if (!PoolProvider._instance) {
      PoolProvider._instance = new PoolProvider();
    }

    return PoolProvider._instance;
  }

  get pool(): Pool {
    return this._pool;
  }
}
