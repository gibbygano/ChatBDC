import { getAppConfig } from "@/config.ts";
import { REST, Routes } from "discord.js";
import commandService from "@/services/commandService.ts";
import type { CommandData } from "@/types.ts";

const { discordBotToken, discordBotClientId, discordServerId } = getAppConfig();

const rest = new REST().setToken(discordBotToken);
const commands = commandService.commands;

const deploy_commands = async () => {
  try {
    rest
      .put(
        Routes.applicationGuildCommands(discordBotClientId, discordServerId),
        {
          body: [],
        },
      )
      .then(() => console.log("Successfully deleted all guild commands."))
      .catch(console.error);
    rest
      .put(Routes.applicationCommands(discordBotClientId), { body: [] })
      .then(() => console.log("Successfully deleted all application commands."))
      .catch(console.error);
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
