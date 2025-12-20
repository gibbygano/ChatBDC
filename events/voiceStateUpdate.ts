import type { VoiceChannel, VoiceState } from "discord.js";

import { ActivityType, Events, PresenceUpdateStatus } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { CancellationService } from "@services";

const buildCancellationKey = (guildId: string, channelId: string) =>
  `${guildId}:${channelId}`;

export default {
  name: Events.VoiceStateUpdate,
  execute(prev_state: VoiceState, current_state: VoiceState) {
    const prev_member_is_bot =
      prev_state.member?.id === prev_state.client.user?.id;
    const prev_member_not_in_channel = prev_state.channelId &&
      !current_state.channelId;

    // Update Presense Upon Leaving Voice Channel
    if (prev_member_is_bot && prev_member_not_in_channel) {
      prev_state.client.user.setPresence({
        activities: [{ name: "💤", type: ActivityType.Custom }],
        status: PresenceUpdateStatus.Idle,
      });

      return;
    }

    // If Someone Joins a Channel Before the Bot Leaves, Cancel Any Matching Timeouts
    const cancellation_service = CancellationService.instance;
    if (current_state.channelId) {
      cancellation_service.cancel(buildCancellationKey(
        current_state.guild.id,
        current_state.channelId,
      ));
    }

    const live_connection = getVoiceConnection(prev_state.guild.id);
    if (!live_connection) {
      return;
    }

    // If Bot Is Not In A Channel OR This Is Not the Bot's Channel, return
    const bot_channel_id = live_connection?.joinConfig.channelId;
    if (!bot_channel_id || prev_state.channelId !== bot_channel_id) {
      return;
    }

    const human_count =
      (prev_state.channel as VoiceChannel).members.filter((m) => !m.user.bot)
        .size;

    const cancellation_key = buildCancellationKey(
      prev_state.guild.id,
      bot_channel_id,
    );

    // If There Are Humans, Cancel Any Timeouts for the Channel and return
    if (human_count > 0) {
      cancellation_service.cancel(cancellation_key);
      return;
    }

    // Disconnect From Voice After 5 Second Delay
    cancellation_service.withCancellation(() => live_connection.destroy(), {
      key: cancellation_key,
      timeoutMs: 5000,
    });
  },
};
