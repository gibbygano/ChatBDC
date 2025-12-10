import {
  FileUploadBuilder,
  LabelBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

const create_modal = (is_audio_upload: boolean) => {
  const upload_modal = new ModalBuilder().setCustomId(
    is_audio_upload ? "audio_upload_modal" : "image_upload_modal",
  )
    .setTitle(
      is_audio_upload ? "Upload Audio" : "Upload Image",
    );

  const attachment = new FileUploadBuilder({ max_values: 1 }).setCustomId(
    "media_to_upload",
  );
  const attachment_label = new LabelBuilder()
    .setLabel(is_audio_upload ? "Audio file" : "Image file")
    .setDescription(
      is_audio_upload ? `MP3/WAV` : `GIF/PNG/JPEG/JPG`,
    )
    .setFileUploadComponent(attachment);

  const custom_filename_input = new TextInputBuilder()
    .setCustomId("custom_filename")
    .setStyle(TextInputStyle.Short).setRequired(false);
  const custom_filename_input_label = new LabelBuilder()
    .setLabel("Override the existing filename here.")
    .setDescription(
      "*This is where you can specify a directory.\n Don't forget the file extension in the name!",
    ).setTextInputComponent(custom_filename_input);

  upload_modal.addLabelComponents(
    attachment_label,
    custom_filename_input_label,
  );

  return upload_modal;
};

export { create_modal };
