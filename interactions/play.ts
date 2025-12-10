import type {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import mediaService from "@/services/mediaService.ts";

const auto_complete = async (interaction: AutocompleteInteraction) => {
  const focused = interaction.options.getFocused().toLowerCase();
  const options = mediaService.media;
  const choices = focused
    ? options.filter((value, key) =>
      key.startsWith(focused) ||
      value.directory.name.toLowerCase().startsWith(focused)
    )
    : options;

  const mappedChoices = choices.map((value, key) => ({
    name: `🔊 ${key}  📁 ${value.directory.pathLabel}`,
    value: key,
  }));

  await interaction.respond(
    mappedChoices.sort((a, b) =>
      a.name > b.name ? 1 : (a.value < b.value ? -1 : 0)
    )
      .slice(
        0,
        mappedChoices.length > 25 ? 25 : mappedChoices.length,
      ),
  );
};

const execute = async (interaction: ChatInputCommandInteraction) => {
  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const voice_channel = member?.voice.channel;
  const requested_media = interaction.options.getString("audio") ?? "";

  await mediaService.playMedia(
    interaction,
    voice_channel,
    requested_media,
  );
};

export { auto_complete, execute };
