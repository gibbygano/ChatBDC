import {
  ActivityType,
  ChatInputCommandInteraction,
  Collection,
  MessageFlags,
  PresenceUpdateStatus,
  VoiceBasedChannel,
} from "discord.js";
import { registerMedia } from "@/utils/register.ts";
import type { Media } from "@/types.ts";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";

class MediaService {
  media = new Collection<string, string>();
  private initialized = false;

  private constructor() {}

  async init() {
    if (this.initialized) {
      return;
    }

    await this.registerMedia();
    this.initialized = true;
  }

  static async create() {
    const instance = new MediaService();
    await instance.init();

    if (!instance.initialized) {
      throw new Error("Could not initialize instance of CommandService.");
    }
    return instance;
  }

  private async registerMedia() {
    await registerMedia("media", (media: Media) => {
      this.media.set(media?.name, media.path);
    });
  }

  async playMedia(
    interaction: ChatInputCommandInteraction,
    voice_channel: VoiceBasedChannel | null | undefined,
    requested_media: string,
  ) {
    const found_media = this.media.get(requested_media);

    if (!voice_channel) {
      return (await interaction.reply({
        content: `you gotta be in a voice channel, yo.`,
        flags: MessageFlags.Ephemeral,
      }));
    }

    if (!found_media) {
      return await interaction.reply({
        content: `Couldn't find '${requested_media}'`,
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voice_channel.id,
        guildId: voice_channel.guild.id,
        adapterCreator: voice_channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      });

      const resource = createAudioResource(found_media);
      const player = createAudioPlayer({ debug: true });
      connection.subscribe(player);
      player.play(resource);

      player.on(AudioPlayerStatus.Playing, () => {
        interaction.client.user.setPresence({
          activities: [{
            name: `▶️ in ${voice_channel.name}`,
            type: ActivityType.Playing,
          }],
          status: PresenceUpdateStatus.Online,
        });
      });

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        player.stop();
      });

      player.on("error", (error) => {
        console.error("Media error: ", error);

        connection.destroy();

        interaction.reply({
          content: `Error trying to play ${found_media}`,
          flags: MessageFlags.Ephemeral,
        });
      });

      interaction.reply({
        content: `Playing ${requested_media}.mp3 in ${voice_channel.name}.`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (e) {
      console.error("Media error: ", e);
      interaction.reply({
        content: `Error trying to play ${found_media}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

const instance = await MediaService.create();

export default instance;
