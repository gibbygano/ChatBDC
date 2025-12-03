import { Collection } from "discord.js";
import { registerMedia } from "@/utils/register.ts";
import type { Media } from "@/types.ts";

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
      console.info(
        `Registering media [${media?.name}]\n\n`,
        media,
      );
      this.media.set(media?.name, media.path);
    });
  }
}

const instance = await MediaService.create();

export default instance;
