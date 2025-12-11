import { BaseRepository } from "./baseRepository.ts";

class CommandsRepository extends BaseRepository {
  constructor() {
    super();
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
    _upsert: T,
  ) => {
    const prepared_statement = {
      name: "upsert-command",
      text: "SELECT commands->$2 as $2 FROM commands WHERE context = $1",
      values: [context, command_name],
    };

    return await this.queryWithSuccess(prepared_statement);
  };
}

const instance = new CommandsRepository();

export default instance;
