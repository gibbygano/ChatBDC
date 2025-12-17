import type { Media } from "@/types.ts";
import {
  ActivityType,
  type ChatInputCommandInteraction,
  type Message,
  MessageFlags,
  PresenceUpdateStatus,
  type VoiceBasedChannel,
} from "discord.js";
import type {
  AudioPlayer,
  AudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { handle_reply } from "./replies.ts";

const join_voice = (voice_channel: VoiceBasedChannel) =>
  joinVoiceChannel({
    channelId: voice_channel.id,
    guildId: voice_channel.guild.id,
    adapterCreator: voice_channel.guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false,
  });

let resource: AudioResource;

const play_audio = (
  connection: VoiceConnection,
  media: Media,
  interaction: ChatInputCommandInteraction | Message,
) => {
  const player = createAudioPlayer();
  resource = createAudioResource(media.path);
  connection.subscribe(player);

  bind_handlers(player, media, connection, interaction);

  player.play(resource);
};

const bind_handlers = (
  player: AudioPlayer,
  found_media: Media,
  connection: VoiceConnection,
  interaction: ChatInputCommandInteraction | Message,
) => {
  player.on(AudioPlayerStatus.Playing, () => {
    interaction.client.user.setPresence({
      activities: [{
        name: `▶️`,
        type: ActivityType.Streaming,
      }],
      status: PresenceUpdateStatus.Online,
    });
  });

  player.on(AudioPlayerStatus.Idle, () => {
    interaction.client.user.setPresence({
      activities: [{
        name: `⏸️`,
        type: ActivityType.Watching,
      }],
      status: PresenceUpdateStatus.Online,
    });
  });

  player.on("error", async (error) => {
    console.error("Media error: ", error);

    connection.destroy();

    return await handle_reply(
      interaction,
      `Error trying to play ${found_media}`,
      MessageFlags.Ephemeral,
    );
  });
};

export { join_voice, play_audio };
