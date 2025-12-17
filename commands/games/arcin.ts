import type { ChatInputCommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("arcin")
    .setDescription("Arc Raiders roll call.")
    .addStringOption((opt) =>
      opt.setName("minutes").setDescription(
        "How many minutes until Arc Raiders?",
      ).setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { execute } = await import("@/interactions/arcin.ts");
    await execute(interaction);
  },
};
