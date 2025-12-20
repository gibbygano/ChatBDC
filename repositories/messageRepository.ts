import type { IPoolProvider } from "@/infrastructure/poolProvider.ts";
import type { Message } from "discord.js";

import { BaseRepository } from "./baseRepository.ts";

export interface IMessageRepository {
  insertMessage(message: Message): Promise<boolean>;
}

export class MessageRepository extends BaseRepository
  implements IMessageRepository {
  constructor(pool_provider: IPoolProvider) {
    super(pool_provider);
  }

  async insertMessage(message: Message): Promise<boolean> {
    message.member?.user.globalName;
    const prepared_statement = {
      name: "insert-message",
      text:
        `INSERT INTO message_history(message_id, user_id, message_content, message_timestamp) 
         VALUES($1, $2, $3, to_timestamp($4))`,
      values: [
        message.id,
        message.member?.user.id,
        message.content,
        message.createdTimestamp,
      ],
    };

    return await this.queryWithSuccess(prepared_statement);
  }
}
