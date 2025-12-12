import type { IPoolProvider } from "@/infrastructure/poolProvider.ts";

import { BaseRepository } from "./baseRepository.ts";

export interface ICommandRepository {
  getCommand<T>(
    context: string,
    command_name: string,
  ): Promise<T | null | undefined>;
  upsertCommand(
    context: string,
    command: string,
    data: object,
  ): Promise<boolean | undefined>;
  mergeCommand(
    context: string,
    commands: string,
    data: object,
  ): Promise<boolean>;
}

export class CommandRepository extends BaseRepository
  implements ICommandRepository {
  constructor(poolProvider: IPoolProvider) {
    super(poolProvider);
  }

  // Get command from commands_json document store in commands table
  async getCommand<T>(
    context: string,
    command_name: string,
  ) {
    const prepared_statement = {
      name: "fetch-command",
      text: `SELECT commands_json->$2 as command 
             FROM commands 
             WHERE context = $1`,
      values: [context, command_name],
    };

    return await this.querySingle<T>(prepared_statement);
  }

  async upsertCommand(
    context: string,
    command: string,
    data: object,
  ) {
    const prepared_statement = {
      name: "upsert-command",
      text: `INSERT INTO commands(context, commands_json)
             VALUES ($1, jsonb_build_object($2::text, $3::jsonb))
             ON CONFLICT (context)
             DO UPDATE SET commands_json = EXCLUDED.commands_json`,
      values: [context, command, data],
    };

    return await this.queryWithSuccess(prepared_statement);
  }

  async mergeCommand(
    context: string,
    command: string,
    data: object,
  ) {
    const prepared_statement = {
      name: "merge-command",
      text: `INSERT INTO commands (context, commands_json)
             VALUES ($1, jsonb_build_object($2::text, $3::jsonb))
             ON CONFLICT (context) 
             DO UPDATE SET commands_json = jsonb_set(
              commands.commands_json,
              ARRAY[$2],
              COALESCE(commands.commands_json->$2, '{}'::jsonb) || $3::jsonb,
              true
            )`,
      values: [context, command, data],
    };

    return await this.queryWithSuccess(prepared_statement);
  }
}
