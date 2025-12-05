import { ActivityType, Client, Events, PresenceUpdateStatus } from "discord.js";
export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.info(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setPresence({
      activities: [{ name: "💤", type: ActivityType.Custom }],
      status: PresenceUpdateStatus.Idle,
    });
  },
};
