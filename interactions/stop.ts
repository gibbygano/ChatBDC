import type { ChatInputCommandInteraction } from "discord.js";

import { MediaService } from "@/services/mediaService.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const voice_channel = member?.voice.channel;
  await MediaService.instance.playMedia(interaction, voice_channel, "stop");
};

export { execute };
