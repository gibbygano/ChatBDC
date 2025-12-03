import { Collection } from "discord.js";
import { register } from "@/utils/register.ts";
import type { Command } from "@/types.ts";

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
    await register("commands", (command: Command) => {
      this.commands.set(command?.data.name, command);
    });
  }
}

const instance = await CommandService.create();

export default instance;
