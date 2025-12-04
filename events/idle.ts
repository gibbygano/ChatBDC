import {
  ActivityType,
  Events,
  PresenceUpdateStatus,
  VoiceState,
} from "discord.js";

export default {
  name: Events.VoiceStateUpdate,
  execute(prev_state: VoiceState, current_state: VoiceState) {
    if (prev_state.member?.id !== current_state.client.user?.id) {
      return;
    }

    if (prev_state.channelId && !current_state.channelId) {
      current_state.client.user.setPresence({
        activities: [{ name: "💤", type: ActivityType.Listening }],
        status: PresenceUpdateStatus.Idle,
      });
    }
  },
};
