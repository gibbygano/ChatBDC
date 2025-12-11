import { PoolProvider } from "@/infrastructure/poolProvider.ts";

interface PreparedStatement {
  name: string;
  text: string;
  values: unknown[];
}

class BaseRepository {
  private pool = PoolProvider.pool;

  protected querySingle = async <T>(
    prepared_statement: PreparedStatement,
  ) => {
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
  };

  protected queryWithSuccess = async (
    prepared_statement: PreparedStatement,
  ) => {
    try {
      const result = await this.pool.query(prepared_statement);

      return !!result.rowCount;
    } catch (e) {
      console.error(e);
    }
  };
}

export type { PreparedStatement };
export { BaseRepository };
