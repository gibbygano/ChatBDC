import "@std/dotenv/load";
import { Client, GatewayIntentBits } from "discord.js";
import { getAppConfig } from "@/config.ts";
import { register } from "@/utils/register.ts";
import { MediaService } from "@/services/mediaService.ts";

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

// Register media and start watcher
const media_service = MediaService.instance;
await media_service.registerMedia();
media_service.watchMedia(); // Run watcher sync, it's essentially a background task

await client.login(discordBotToken);
