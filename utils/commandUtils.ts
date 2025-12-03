import type { DiscordBotClient } from "@/types.ts";
import { Collection } from "discord.js";
import { join } from "@std/path/join";
import { walk } from "@std/fs/walk";

const registerCommands = async (client: DiscordBotClient) => {
  client.commands = new Collection();

  const __dirname = import.meta.dirname as string;
  const foldersPath = join(Deno.cwd(), "commands");

  for await (const dirEntry of walk(foldersPath)) {
    if (dirEntry.name.endsWith(".ts")) {
      const command = (await import(dirEntry.path)).default;
      console.info(`Registering command [${command?.data.name}]\n\n`, command);
      client.commands.set(command?.data.name, command);
    }
  }
};

export { registerCommands };
