import type { ChatInputCommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "discord.js";

export default {
  cooldown: 1,
  data: new SlashCommandBuilder().setName("gimmecarl").setDescription(
    "Gimme sum carl",
  ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { execute } = await import("@/interactions/gimmecarl.ts");
    await execute(interaction);
  },
};
