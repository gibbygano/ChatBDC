import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

import { MediaService } from "@/services/mediaService.ts";

const media_service = MediaService.instance;

const auto_complete = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused().toLowerCase();
  const options = media_service.media;
  const choices = focused
    ? options.filter((value) =>
      value.search_string.startsWith(focused) ||
      value.directory.search_string.startsWith(focused)
    )
    : options;

  const mappedChoices = choices.map((value) => ({
    name: `🔊 ${value.short_name}  📁 ${value.directory.pathLabel}`,
    value: value.search_string,
  }));

  const sorted = mappedChoices.sort((a, b) =>
    a.value === focused
      ? -1
      : b.value === focused
      ? 1
      : a.value > b.value
      ? 1
      : (a.value < b.value ? -1 : 0)
  )
    .slice(
      0,
      mappedChoices.length > 25 ? 25 : mappedChoices.length,
    );

  await interaction.respond(sorted);
};

const execute = async (interaction: ChatInputCommandInteraction) => {
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const voice_channel = member?.voice.channel;
  const requested_media = interaction.options.getString("audio") ?? "";

  await media_service.playMedia(
    interaction,
    voice_channel,
    requested_media,
  );
};

export { auto_complete, execute };
