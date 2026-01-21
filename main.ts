import "@std/dotenv/load";
import { getAppConfig } from "@/config.ts";
import { register, registerOSSignalListeners } from "@/utils/register.ts";
import { MediaService } from "@services";
import logger from "@logging";
import { ClientService } from "./services/clientService.ts";

const client = ClientService.instance.client;

registerOSSignalListeners(async () => {
  logger.log_warning("Shutting down");

  await client.destroy();
  Deno.exit(0);
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

const { discordBotToken } = getAppConfig();
await client.login(discordBotToken);
