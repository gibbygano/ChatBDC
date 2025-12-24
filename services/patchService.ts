import type { Client } from "discord.js";

export interface IPatchService {
  checkPatch(client: Client, notify_channel_id: string): Promise<void>;
}
