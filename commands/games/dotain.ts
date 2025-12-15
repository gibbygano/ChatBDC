import type { ChatInputCommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("dotain")
    .setDescription("Dota roll call.")
    .addStringOption((opt) =>
      opt.setName("minutes").setDescription(
        "How many minutes until Dota?",
      ).setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { execute } = await import("@/interactions/dotain.ts");
    await execute(interaction);
  },
};
