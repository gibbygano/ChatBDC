import type { IPoolProvider } from "@/infrastructure/poolProvider.ts";
import type { Patch } from "@/pg.types.ts";

import { BaseRepository } from "./baseRepository.ts";

export interface IPatchRepository {
  getPatchByGameId(game_id: string): Promise<Patch | null | undefined>;
  updatePatchByGameId(
    game_id: string,
    updated_timestamp: number,
    latest_version: string,
  ): Promise<boolean>;
}

export class PatchRepository extends BaseRepository
  implements IPatchRepository {
  constructor(pool_provider: IPoolProvider) {
    super(pool_provider);
  }

  async updatePatchByGameId(
    game_id: string,
    updated_timestamp: number,
    latest_version: string,
  ): Promise<boolean> {
    const prepared_statement = {
      name: "update-patch",
      text: `UPDATE game_patch
             SET latest_version = $1, 
                 latest_version_date = to_timestamp($2)
             WHERE game = $3`,
      values: [
        latest_version,
        updated_timestamp,
        game_id,
      ],
    };

    return await this.queryWithSuccess(prepared_statement);
  }

  async getPatchByGameId(game_id: string): Promise<Patch | null | undefined> {
    const prepared_statement = {
      name: "get-patch",
      text: `SELECT 
              game, 
              latest_version, 
              latest_version_date,
              patch_url
             FROM game_patch
             WHERE game = $1`,
      values: [
        game_id,
      ],
    };

    return await this.querySingle<Patch>(prepared_statement);
  }
}
