import "@std/dotenv/load";
import { Client, GatewayIntentBits } from "discord.js";
import { getAppConfig } from "@/config.ts";
import { register } from "@/utils/register.ts";

Deno.serve((req) => {
  if (new URL(req.url).pathname === "/health") {
    return new Response("OK", { status: 200 });
  }
  return new Response("Not Found", { status: 404 });
});

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

// discord.js types fucking suck
// deno-lint-ignore no-explicit-any
await register("events", (event: any) => {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.login(discordBotToken);
