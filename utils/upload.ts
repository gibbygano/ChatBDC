import type { Attachment, ModalSubmitInteraction } from "discord.js";
import { MessageFlags } from "discord.js";
import { ensureDir } from "@std/fs/ensure-dir";
import { join } from "@std/path/join";

const allowed_types = {
  image: ["image/png", "image/jpeg"],
  audio: ["audio/wav", "audio/mpeg"],
};

const upload = async (
  interaction: ModalSubmitInteraction,
  file: Attachment,
  directory: string,
  file_name?: string | null,
) => {
  const response = await fetch(file.url);
  const buffer = await response.arrayBuffer();

  const fileName = file_name?.length ? file_name : file.name;
  const filePath = join(directory, fileName);

  if (fileName.includes("/")) {
    await ensureDir(filePath.substring(0, filePath.lastIndexOf("/")));
  }

  await Deno.writeFile(filePath, new Uint8Array(buffer), { create: true });

  await interaction.reply({
    content: `✅ Uploaded \`${fileName}\``,
    flags: MessageFlags.Ephemeral,
  });
};

const upload_audio = async (
  interaction: ModalSubmitInteraction,
  file: Attachment,
  directory: string,
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

  await upload(interaction, file, directory, file_name);
};

const upload_image = async (
  interaction: ModalSubmitInteraction,
  file: Attachment,
  directory: string,
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

  await upload(interaction, file, join(Deno.cwd(), directory), file_name);
};

const handle_upload = async (interaction: ModalSubmitInteraction) => {
  const file = interaction.fields.getUploadedFiles("media_to_upload")?.first();
  const file_name = interaction.fields.getTextInputValue("custom_filename");
  const upload_directory = interaction.fields.getStringSelectValues(
    "upload_directory_select",
  )[0];

  if (!file || !upload_directory) {
    return await interaction.reply({
      content: "There's nothing here, silly",
      flags: MessageFlags.Ephemeral,
    });
  }

  try {
    if (interaction.customId === "audio_upload_modal") {
      return await upload_audio(interaction, file, upload_directory, file_name);
    }

    return await upload_image(interaction, file, upload_directory, file_name);
  } catch (e) {
    console.error(e);
  }
};

export { handle_upload };
