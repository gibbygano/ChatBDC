import type { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import { execute } from "@/interactions/stop.ts";

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription(
    "STAHP",
  ),
  execute: async (interaction: ChatInputCommandInteraction) =>
    await execute(interaction),
};
