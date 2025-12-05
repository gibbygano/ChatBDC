import { SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("user").setDescription(
    "Provides information about the user.",
  ),
  async execute(interaction: ChatInputCommandInteraction) {
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    await interaction.reply(
      `This command was run by ${member?.user.username}, who joined on ${member?.joinedAt}.`,
    );
  },
};
