import { load } from "@std/dotenv";
import { getAppConfig } from "@/config.ts";
import { REST, Routes } from "discord.js";
import { CommandService } from "@/services/commandService.ts";

await load({ export: true });
const { discordBotToken, discordBotClientId } = getAppConfig();

const rest = new REST().setToken(discordBotToken);
const commands = await CommandService.instance.registerCommands();

(async () => {
  try {
    console.info(
      `Started refreshing ${commands.size} application (/) commands.`,
    );
    const data = await rest.put(
      Routes.applicationCommands(discordBotClientId),
      { body: commands.map((c) => c.data) },
    );
    console.info(
      `Successfully reloaded ${(data as []).length} application (/) commands.`,
    );
  } catch (error) {
    console.error(error);
  }
})();
