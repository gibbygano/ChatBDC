import type { ChatInputCommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription("Upload shit")
    .addStringOption((opt) =>
      opt.setName("upload_media_type").setDescription(
        "What kind of media do you want to upload?",
      ).setRequired(true).addChoices(
        { name: "Audio", value: "audio" },
        { name: "Image", value: "image" },
      )
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const media_type = interaction.options.getString("upload_media_type");

    const { create_modal } = await import("@/utils/modal.ts");
    await interaction.showModal(create_modal(media_type === "audio"));
  },
};
