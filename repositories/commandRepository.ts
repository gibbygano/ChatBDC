import { BaseRepository } from "./baseRepository.ts";

class CommandRepository extends BaseRepository {
  private static _instance: CommandRepository;

  private constructor() {
    super();
  }

  static get instance() {
    if (!CommandRepository._instance) {
      CommandRepository._instance = new CommandRepository();
    }

    return CommandRepository._instance;
  }

  // Get command from commands_json document store in commands table
  getCommand = async <T>(
    context: string,
    command_name: string,
  ) => {
    const prepared_statement = {
      name: "fetch-command",
      text: `SELECT commands_json->$2 as command 
             FROM commands 
             WHERE context = $1`,
      values: [context, command_name],
    };

    return await this.querySingle<T>(prepared_statement);
  };

  upsertCommand = async (
    context: string,
    command: string,
    data: object,
  ) => {
    const prepared_statement = {
      name: "upsert-command",
      text: `INSERT INTO commands(context, commands_json)
             VALUES ($1, jsonb_build_object($2::text, $3::jsonb))
             ON CONFLICT (context)
             DO UPDATE SET commands_json = EXCLUDED.commands_json`,
      values: [context, command, data],
    };

    return await this.queryWithSuccess(prepared_statement);
  };

  mergeCommand = async (
    context: string,
    command: string,
    data: object,
  ) => {
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
  };
}

export { CommandRepository };
