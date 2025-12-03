import "@std/dotenv";
import { getAppConfig } from "@/config.ts";
import { REST, Routes } from "discord.js";
import commandService from "@/services/commandService.ts";

const { discordBotToken, discordBotClientId, discordServerId } = getAppConfig();
const rest = new REST().setToken(discordBotToken);
const commands = commandService.commands;

console.log(discordBotClientId, discordBotToken, discordServerId);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.size} application (/) commands.`,
    );
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(discordBotClientId, discordServerId),
      { body: commands },
    );
    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
