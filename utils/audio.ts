import type { VoiceBasedChannel } from "discord.js";
import type { VoiceConnection } from "@discordjs/voice";
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";

const join_voice = (voice_channel: VoiceBasedChannel) =>
  joinVoiceChannel({
    channelId: voice_channel.id,
    guildId: voice_channel.guild.id,
    adapterCreator: voice_channel.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

const play_audio = (connection: VoiceConnection, media_path: string) => {
  const resource = createAudioResource(media_path);
  const player = createAudioPlayer({ debug: true });
  connection.subscribe(player);
  player.play(resource);

  return player;
};

export { join_voice, play_audio };
