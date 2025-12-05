import type { Attachment, ChatInputCommandInteraction } from "discord.js";
import { MessageFlags, SlashCommandBuilder } from "discord.js";
import { ensureDir } from "@std/fs/ensure-dir";
import { join } from "@std/path/join";

const allowed_types = {
  image: ["image/png", "image/jpeg"],
  audio: ["audio/wav", "audio/mpeg"],
};

const upload_audio = async (
  interaction: ChatInputCommandInteraction,
  file: Attachment,
  file_name?: string | null,
) => {
  if (
    !file.contentType &&
    !allowed_types.audio.includes(file.contentType as string)
  ) {
    return await interaction.reply({
      content: `Content type must be wav or mpeg`,
      flags: MessageFlags.Ephemeral,
    });
  }

  await upload(interaction, file, "media/audio", file_name);
};

const upload_image = async (
  interaction: ChatInputCommandInteraction,
  file: Attachment,
  file_name?: string | null,
) => {
  if (
    !file.contentType &&
    !allowed_types.image.includes(file.contentType as string)
  ) {
    return await interaction.reply({
      content: `Content type must be png or jpeg`,
      flags: MessageFlags.Ephemeral,
    });
  }

  await upload(interaction, file, "media/images", file_name);
};

const upload = async (
  interaction: ChatInputCommandInteraction,
  file: Attachment,
  directory: string,
  file_name?: string | null,
) => {
  const response = await fetch(file.url);
  const buffer = await response.arrayBuffer();

  const fileName = file_name ?? file.name;
  const filePath = join(Deno.cwd(), directory, fileName);

  if (fileName.includes("/")) {
    await ensureDir(filePath.substring(0, filePath.lastIndexOf("/")));
  }

  await Deno.writeFile(filePath, new Uint8Array(buffer), { create: true });

  await interaction.reply({
    content: `✅ Uploaded \`${fileName}\` library`,
    flags: MessageFlags.Ephemeral,
  });
};

export default {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription("Upload shit")
    .addStringOption((opt) =>
      opt.setName("type").setDescription("File type").setRequired(true)
        .addChoices({ name: "image", value: "image" }, {
          name: "audio",
          value: "audio",
        })
    )
    .addAttachmentOption((opt) =>
      opt.setName("file").setDescription("File to upload").setRequired(true)
    ).addStringOption((opt) =>
      opt.setName("filename").setDescription("Optional: Set a filename")
    ),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const file = interaction.options.getAttachment("file");
    const file_type = interaction.options.getString("type");
    const file_name = interaction.options.getString("filename");

    if (!file) {
      return await interaction.reply({
        content: "There's nothing here, silly",
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      if (file_type === "audio") {
        return await upload_audio(interaction, file, file_name);
      }

      return await upload_image(interaction, file, file_name);
    } catch (e) {
      console.error(e);
    }
  },
};
