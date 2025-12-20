import type { IPoolProvider } from "@/infrastructure/poolProvider.ts";
import type { User } from "discord.js";

import { BaseRepository } from "./baseRepository.ts";

export interface IUserRepository {
  upsertUser(user: User): Promise<boolean>;
}

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(pool_provider: IPoolProvider) {
    super(pool_provider);
  }

  async upsertUser(user: User): Promise<boolean> {
    const prepared_statement = {
      name: "upsert-user",
      text: `INSERT INTO discord_user(user_id, global_name, display_name) 
             VALUES($1, $2, $3)
             ON CONFLICT (user_id) DO UPDATE
             SET
                display_name = EXCLUDED.display_name
             WHERE EXCLUDED.display_name != discord_user.display_name`,
      values: [user.id, user.globalName, user.displayName],
    };

    return await this.queryWithSuccess(prepared_statement);
  }
}
