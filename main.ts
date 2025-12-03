import "@std/dotenv/load";
import { Client, GatewayIntentBits } from "discord.js";
import { getAppConfig } from "@/config.ts";
import { register } from "@/utils/register.ts";

const { discordBotToken } = getAppConfig();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

await register("events", (event) => {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.login(discordBotToken);
