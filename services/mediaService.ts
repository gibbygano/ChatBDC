import type { Media, MediaDirectory } from "@/types.ts";
import type {
  ChatInputCommandInteraction,
  Message,
  VoiceBasedChannel,
} from "discord.js";
import { Collection, MessageFlags } from "discord.js";
import { join } from "@std/path/join";
import { debounce } from "@std/async/debounce";
import { registerMedia } from "@/utils/register.ts";
import { join_voice, play_audio } from "@/utils/audio.ts";
import { handle_file_reply, handle_reply } from "@/utils/replies.ts";
import { audio_directory } from "@/constants.ts";

class MediaService {
  media = new Collection<string, Media>();
  directories: Map<string, MediaDirectory> = new Map<string, MediaDirectory>();

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
    await registerMedia(audio_directory, (media: Media) => {
      this.media.set(media.short_name, media);
      this.directories.set(media.directory.name, media.directory);
    });
    console.timeEnd("Media scan");
  }

  private async watchMedia() {
    const clear_and_register = debounce(async (event: Deno.FsEvent) => {
      console.info("[%s] %s", event.kind, event.paths[0]);
      this.media.clear();
      this.directories.clear();
      await this.registerMedia();
    }, 15000);

    const watcher = Deno.watchFs(join(Deno.cwd(), audio_directory));

    for await (const event of watcher) {
      clear_and_register(event);
    }
  }

  async playMedia(
    interaction: ChatInputCommandInteraction | Message,
    voice_channel: VoiceBasedChannel | null | undefined,
    requested_media: string,
    skip_reply: boolean = false,
  ) {
    const found_media = this.media.get(requested_media);
    if (!found_media) {
      return await handle_reply(
        interaction,
        `Couldn't find '${requested_media}'. Try using \`/play\` to search.`,
        MessageFlags.Ephemeral,
      );
    }

    if (!voice_channel) {
      const file = await Deno.readFile(found_media.path);
      return await handle_file_reply(
        interaction,
        `🔊 ${found_media.full_name} | 📁 ${found_media.directory.name}`,
        file,
        found_media.full_name,
      );
    }

    try {
      const connection = join_voice(voice_channel);
      play_audio(connection, found_media, interaction);

      if (!skip_reply) {
        await handle_reply(
          interaction,
          `Playing ${requested_media}.mp3 in ${voice_channel.name}.`,
          MessageFlags.Ephemeral,
        );
      }
    } catch (e) {
      console.error("Media error: ", e);

      handle_reply(
        interaction,
        `Error trying to play ${found_media}`,
        MessageFlags.Ephemeral,
      );
    }
  }
}

const instance = await MediaService.create();

export default instance;
