import type { ChatInputCommandInteraction } from "discord.js";
import mediaService from "@/services/mediaService.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const voice_channel = member?.voice.channel;
  await mediaService.playMedia(
    interaction,
    voice_channel,
    "stop",
  );
};

export { execute };
