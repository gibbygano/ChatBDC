import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { ActivityType, Message } from "discord.js";
import mediaService from "@/services/mediaService.ts";

export default {
  data: {
    name: "audio",
    description: "Play a sound file",
    usage: "!<@sound>",
    cooldown: 3,
  },
  async execute(message: Message) {
    const voice_channel = message.member?.voice.channel;

    if (!voice_channel) {
      return (await message.reply(`you gotta be in a voice channel, yo.`));
    }

    const media = mediaService.media;
    const requested_media = message.content.substring(1);
    const found_media = media.get(requested_media);

    if (!found_media) {
      return await message.reply(`Couldn't find that media file :(.`);
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
        message.client.user.setActivity(`▶️ in ${voice_channel.name}`, {
          type: ActivityType.Custom,
        });
      });

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();

        message.client.user.setActivity("⏸️", { type: ActivityType.Custom });
      });

      player.on("error", (error) => {
        console.error("Media error: ", error);

        connection.destroy();

        message.reply(`Error trying to play ${found_media}`);
      });
    } catch (e) {
      console.error("Media error: ", e);
      await message.reply(`Error trying to play ${found_media}`);
    }
  },
};
