import type { Client } from "discord.js";

import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import logger from "@logging";
import {
  GuildRepository,
  PatchRepository,
  UserRepository,
} from "@repositories";
import { PoolProvider } from "@/infrastructure/poolProvider.ts";
import { registerQueueListeners } from "@/utils/register.ts";
import {
  CronService,
  Dota2PatchService,
  GuildService,
  UserService,
} from "@services";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    // Register guilds
    const guild_service = new GuildService(
      new GuildRepository(PoolProvider.instance),
    );
    await guild_service.registerGuilds(client.guilds);

    // Register users
    const user_service = new UserService(
      new UserRepository(PoolProvider.instance),
    );
    await user_service.registerUsers(client.guilds);

    // Register all queue listeners
    await registerQueueListeners(client);

    // Check for new dota 2 patches
    // Backoff 30s, 2m, 5m
    const dota2PatchService = new Dota2PatchService(
      new PatchRepository(PoolProvider.instance),
    );
    const cron_service = new CronService();
    cron_service.runEveryNthMinute(
      "dota-patch-watcher",
      30,
      async () => await dota2PatchService.checkPatch(client),
      [30000, 120000, 300000],
    );

    client.user?.setPresence({
      activities: [{ name: "💤", type: ActivityType.Custom }],
      status: PresenceUpdateStatus.Idle,
    });

    logger.log_info("Ready!", client.user?.tag);
  },
};
