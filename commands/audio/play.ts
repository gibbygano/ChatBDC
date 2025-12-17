import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

import { SlashCommandBuilder } from "discord.js";

export default {
  cooldown: 3,
  data: new SlashCommandBuilder().setName("play").setDescription(
    "Play a sound file",
  ).addStringOption((opt) =>
    opt.setName("audio").setDescription("Audio to play").setRequired(true)
      .setAutocomplete(true)
  ),
  autocomplete: async (interaction: AutocompleteInteraction) => {
    const { auto_complete } = await import("@/interactions/play.ts");
    await auto_complete(interaction);
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const { execute } = await import("@/interactions/play.ts");
    await execute(interaction);
  },
};
