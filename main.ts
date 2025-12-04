import "@std/dotenv/load";
import {
  ActivityType,
  Client,
  GatewayIntentBits,
  PresenceManager,
  PresenceUpdateStatus,
} from "discord.js";
import { getAppConfig } from "@/config.ts";
import { register } from "@/utils/register.ts";
import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";

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
