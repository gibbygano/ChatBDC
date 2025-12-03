import { ChatInputCommandInteraction, Collection } from "discord.js";
import { join } from "@std/path/join";
import { walk } from "@std/fs/walk";

interface Command {
  data: unknown;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

class CommandService {
  commands = new Collection<string, Command>();
  private initialized = false;

  private constructor() {}

  async init() {
    if (this.initialized) {
      return;
    }

    await this.registerCommands();
    this.initialized = true;
  }

  static async create() {
    const instance = new CommandService();
    await instance.init();

    if (!instance.initialized) {
      throw new Error("Could not initialize instance of CommandService.");
    }
    return instance;
  }

  private async registerCommands() {
    const foldersPath = join(Deno.cwd(), "commands");

    for await (const dirEntry of walk(foldersPath)) {
      if (dirEntry.name.endsWith(".ts")) {
        const command = (await import(dirEntry.path)).default;
        console.info(
          `Registering command [${command?.data.name}]\n\n`,
          command,
        );
        this.commands.set(command?.data.name, command);
      }
    }
  }
}

const instance = await CommandService.create();

export default instance;
