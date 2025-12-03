import { getAppConfig } from "@/config.ts";
import { REST, Routes } from "discord.js";
import commandService from "@/services/commandService.ts";
import type { CommandData } from "@/types.ts";

const { discordBotToken, discordBotClientId } = getAppConfig();

const rest = new REST().setToken(discordBotToken);
const commands = commandService.commands;

const deploy_commands = async () => {
  try {
    console.info(
      `Started refreshing ${commands.size} application (/) commands.`,
    );
    const data = await rest.put(
      Routes.applicationCommands(discordBotClientId),
      { body: commands.map((c) => c.data) },
    );
    console.info(
      `Successfully reloaded ${
        (data as Array<CommandData>).length
      } application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
};

export { deploy_commands };
