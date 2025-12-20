import type { Client } from "discord.js";

import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import { GuildRepository, UserRepository } from "@repositories";
import { PoolProvider } from "@/infrastructure/poolProvider.ts";
import { registerQueueListeners } from "@/utils/register.ts";
import { GuildService, UserService } from "@services";

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

    client.user?.setPresence({
      activities: [{ name: "💤", type: ActivityType.Custom }],
      status: PresenceUpdateStatus.Idle,
    });

    console.info(`Ready! Logged in as ${client.user?.tag}`);
  },
};
