import type { WalkEntry } from "@std/fs/walk";
import type { ChatInputCommandInteraction } from "discord.js";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { join } from "@std/path/join";
import { walk } from "@std/fs/walk";
import mediaService from "@/services/mediaService.ts";
import carl_quotes from "@/carlQuotes.ts";
import { image_directory } from "@/constants.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const carl_dir = join(Deno.cwd(), image_directory, "carl");
  const carls = walk(carl_dir);
  const carl_list = new Array<WalkEntry>();

  for await (const carl of carls) {
    if (carl.isFile) {
      carl_list.push(carl);
    }
  }

  const carl_index = Math.floor(Math.random() * carl_list.length);
  const my_carl = carl_list[carl_index];

  const file = new AttachmentBuilder(my_carl.path);
  const img_embed = new EmbedBuilder().setImage(
    `attachment://${my_carl.name}`,
  ).setTitle(
    `> ${carl_quotes[Math.floor(Math.random() * carl_quotes.length)]}`,
  );

  const member = await interaction.guild?.members.fetch(interaction.user.id);
  const voice_channel = member?.voice.channel;

  if (voice_channel) {
    const carl_sounds = mediaService.media.filter((_, k) =>
      k.startsWith("carl")
    ).map((_, k) => k);

    const my_carl_sound_index = Math.floor(
      Math.random() * carl_sounds.length,
    );

    const my_carl_sound = carl_sounds[my_carl_sound_index];
    await mediaService.playMedia(
      interaction,
      voice_channel,
      my_carl_sound,
      true,
    );
  }

  await interaction?.reply({ embeds: [img_embed], files: [file] });
};

export { execute };
