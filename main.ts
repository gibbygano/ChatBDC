import "@std/dotenv/load";
import { Client, GatewayIntentBits } from "discord.js";
import type { ClientEvents } from "discord.js";
import { getAppConfig } from "@/config.ts";
import { register } from "@/utils/register.ts";
import { Event } from "@/types.ts";

const { discordBotToken } = getAppConfig();
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

await register("events", (event: ClientEvents) => {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.login(discordBotToken);
