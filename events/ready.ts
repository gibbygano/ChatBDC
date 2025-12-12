import type { Client } from "discord.js";

import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import { GuildRepository } from "@/repositories/guildRepository.ts";
import { PoolProvider } from "@/infrastructure/poolProvider.ts";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    const guild_repository = new GuildRepository(PoolProvider.instance);
    await guild_repository.registerGuilds(client.guilds);

    client.user?.setPresence({
      activities: [{ name: "💤", type: ActivityType.Custom }],
      status: PresenceUpdateStatus.Idle,
    });

    console.info(`Ready! Logged in as ${client.user?.tag}`);
  },
};
