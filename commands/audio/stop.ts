import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import mediaService from "@/services/mediaService.ts";

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription(
    "STAHP",
  ),
  async execute(interaction: ChatInputCommandInteraction) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const voice_channel = member?.voice.channel;

    await mediaService.playMedia(interaction, voice_channel, "stop");
  },
};
