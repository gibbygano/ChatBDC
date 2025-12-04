import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import mediaService from "@/services/mediaService.ts";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder().setName("play").setDescription(
    "Play a sound file",
  ).addStringOption((opt) =>
    opt.setName("audio").setDescription("Audio to play").setRequired(true)
      .setAutocomplete(true)
  ),
  async autocomplete(interaction: AutocompleteInteraction) {
    const focused = interaction.options.getFocused().toLowerCase();
    const options = mediaService.media;
    const choices = focused
      ? options.filter((value, key) =>
        key.startsWith(focused) ||
        value.parentDir.toLowerCase().startsWith(focused)
      )
      : options;

    const mappedChoices = choices.map((value, key) => ({
      name: `🔊 ${key} | 📁 ${value.parentDir}`,
      value: key,
    }));

    await interaction.respond(
      mappedChoices.slice(
        0,
        mappedChoices.length > 25 ? 25 : mappedChoices.length,
      ),
    );
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const voice_channel = member?.voice.channel;
    const requested_media = interaction.options.getString("audio") ?? "";

    await mediaService.playMedia(interaction, voice_channel, requested_media);
  },
};
