import { getAppConfig } from "@/config.ts";
import { REST, Routes } from "discord.js";
import { load } from "@std/dotenv";

await load({ export: true });
const { discordBotToken, discordBotClientId, discordServerId } = getAppConfig();
const rest = new REST().setToken(discordBotToken);

(() => {
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
})();
