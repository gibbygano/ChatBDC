import { join } from "@std/path/join";
import { debounce } from "@std/async/debounce";
import {
  ActivityType,
  Collection,
  MessageFlags,
  PresenceUpdateStatus,
} from "discord.js";
import type {
  ChatInputCommandInteraction,
  VoiceBasedChannel,
} from "discord.js";
import { type Media } from "@/types.ts";
import { registerMedia } from "@/utils/register.ts";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";

class MediaService {
  media = new Collection<string, Media>();

  private initialized = false;

  private constructor() {}

  async init() {
    if (this.initialized) {
      return;
    }

    await this.registerMedia();
    this.watchMedia();
    this.initialized = true;
  }

  static async create() {
    const instance = new MediaService();
    await instance.init();

    if (!instance.initialized) {
      throw new Error("Could not initialize instance of MediaService.");
    }
    return instance;
  }

  private async registerMedia() {
    console.time("Media scan");
    await registerMedia("media/audio", (media: Media) => {
      this.media.set(media.name, media);
    });
    console.timeEnd("Media scan");
  }

  private async watchMedia() {
    const log = debounce(async (event: Deno.FsEvent) => {
      console.info("[%s] %s", event.kind, event.paths[0]);
      this.media.clear();
      await this.registerMedia();
    }, 15000);

    const watcher = Deno.watchFs(join(Deno.cwd(), "media/audio"));

    for await (const event of watcher) {
      log(event);
    }
  }

  async playMedia(
    interaction: ChatInputCommandInteraction,
    voice_channel: VoiceBasedChannel | null | undefined,
    requested_media: string,
    skip_reply: boolean = false,
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

      const resource = createAudioResource(found_media.path);
      const player = createAudioPlayer({ debug: true });
      connection.subscribe(player);
      player.play(resource);

      if (!skip_reply) {
        interaction.reply({
          content: `Playing ${requested_media}.mp3 in ${voice_channel.name}.`,
          flags: MessageFlags.Ephemeral,
        });
      }

      player.on(AudioPlayerStatus.Playing, () => {
        interaction.client.user.setPresence({
          activities: [{
            name: `▶️ in ${voice_channel.name}`,
            type: ActivityType.Streaming,
          }],
          status: PresenceUpdateStatus.Online,
        });
      });

      player.on(AudioPlayerStatus.Idle, () => {
        interaction.client.user.setPresence({
          activities: [{
            name: `⏸️ in ${voice_channel.name}`,
            type: ActivityType.Watching,
          }],
          status: PresenceUpdateStatus.Online,
        });
      });

      player.on("error", (error) => {
        console.error("Media error: ", error);

        connection.destroy();

        interaction.reply({
          content: `Error trying to play ${found_media}`,
          flags: MessageFlags.Ephemeral,
        });
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
