import { Collection } from "discord.js";
import { Client } from "discord.js";

type DiscordBotClient = Client & { commands: Collection<string, string> };

export type { DiscordBotClient };
