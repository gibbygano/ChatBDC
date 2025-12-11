import { BaseRepository } from "./baseRepository.ts";

class CommandsRepository extends BaseRepository {
  private static _instance: CommandsRepository;

  private constructor() {
    super();
  }

  static get instance() {
    if (!CommandsRepository._instance) {
      CommandsRepository._instance = new CommandsRepository();
    }

    return CommandsRepository._instance;
  }

  getCommand = async <T>(
    context: string,
    command_name: string,
  ) => {
    const prepared_statement = {
      name: "fetch-command",
      text: "SELECT commands->$2 as command FROM commands WHERE context = $1",
      values: [context, command_name],
    };

    return await this.querySingle<T>(prepared_statement);
  };

  upsertCommand = async <T>(
    context: string,
    command_name: string,
    upsert: string,
  ) => {
    const prepared_statement = {
      name: "upsert-command",
      text:
        `UPDATE commands SET commands = jsonb_set(commands, '${command_name}', to_jsonb($2::text), true)
             WHERE context = $1`,
      values: [context, upsert],
    };

    return await this.queryWithSuccess(prepared_statement);
  };
}

export { CommandsRepository };
