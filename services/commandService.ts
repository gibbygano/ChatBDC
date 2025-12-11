import type { Command } from "@/types.ts";
import { Collection } from "discord.js";
import { register } from "@/utils/register.ts";

class CommandService {
  private static _instance: CommandService;
  private static _commands = new Collection<string, Command>();

  private constructor() {}

  static get instance(): CommandService {
    if (!CommandService._instance) {
      CommandService._instance = new CommandService();
    }

    return CommandService._instance;
  }

  async registerCommands() {
    if (CommandService._commands.keys.length === 0) {
      await register("commands", (command: Command) => {
        CommandService._commands.set(command?.data.name, command);
      });
    }

    return CommandService._commands;
  }
}

export { CommandService };
