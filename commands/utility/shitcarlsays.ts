import type { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("shitcarlsays").setDescription(
    "Add some shit you heard Carl say",
  ).addStringOption((opt) =>
    opt.setName("shit_carl_said").setDescription("Shit that Carl hath spoke")
      .setRequired(true)
  ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { execute } = await import("@/interactions/shitcarlsays.ts");
    await execute(interaction);
  },
};
