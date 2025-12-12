import type { IPoolProvider } from "@/infrastructure/poolProvider.ts";
import type { PreparedStatement } from "@/pg.types.ts";
import type { Pool } from "pg";

export class BaseRepository {
  private pool: Pool;

  protected constructor(poolProvider: IPoolProvider) {
    this.pool = poolProvider.pool;
  }

  protected async querySingle<T>(
    prepared_statement: PreparedStatement,
  ) {
    try {
      const result = await this.pool.query(prepared_statement);

      if (!result.rowCount) {
        return null;
      }

      if (result.rowCount > 1) {
        throw new Error("Result returned multiple rows.");
      }

      return <T> result.rows[0];
    } catch (e) {
      console.error(e);
    }
  }

  protected async queryWithSuccess(
    prepared_statement: PreparedStatement,
  ) {
    try {
      const result = await this.pool.query(prepared_statement);

      return !!result.rowCount;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
