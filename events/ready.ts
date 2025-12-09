import type { Client } from "discord.js";
import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import guildRepository from "@/repositories/guildRepository.ts";

export default {
  name: Events.ClientReady,
  once: true,
  execute: async (client: Client) => {
    console.info(`Ready! Logged in as ${client.user?.tag}`);

    await guildRepository.registerGuilds(client.guilds);

    client.user?.setPresence({
      activities: [{ name: "💤", type: ActivityType.Custom }],
      status: PresenceUpdateStatus.Idle,
    });
  },
};
