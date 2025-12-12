import type { ChatInputCommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription(
    "STAHP",
  ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { execute } = await import("@/interactions/stop.ts");
    await execute(interaction);
  },
};
