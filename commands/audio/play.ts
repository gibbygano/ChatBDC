import { SlashCommandBuilder } from "discord.js";
import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import { auto_complete, execute } from "@/interactions/play.ts";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("play").setDescription(
    "Play a sound file",
  ).addStringOption((opt) =>
    opt.setName("audio").setDescription("Audio to play").setRequired(true)
      .setAutocomplete(true)
  ),
  autocomplete: async (interaction: AutocompleteInteraction) =>
    await auto_complete(interaction),
  execute: async (interaction: ChatInputCommandInteraction) =>
    await execute(interaction),
};
