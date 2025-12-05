import type { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { execute } from "@/interactions/gimmecarl.ts";

export default {
  cooldown: 1,
  data: new SlashCommandBuilder().setName("gimmecarl").setDescription(
    "Gimme sum carl",
  ),
  execute: async (interaction: ChatInputCommandInteraction) =>
    await execute(interaction),
};
