import type { ButtonInteraction } from "discord.js";

import { MessageFlags } from "discord.js";
import { ReminderService } from "@/services/reminderService.ts";

const handle_rsvp = async (
  interaction: ButtonInteraction,
  reminder_id: string,
) => {
  const reminder_service = ReminderService.instance;
  const reminder = reminder_service.getReminder(reminder_id);

  if (!reminder) {
    return await interaction.reply({
      content: `⚠️ Reminder no longer exists.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  reminder_service.joinReminder(interaction.user.id, reminder_id);

  return await interaction.reply({
    content: `✅ You've been added to the ${reminder.reminder_type} reminder!`,
    flags: MessageFlags.Ephemeral,
  });
};

const handle_button_press = async (interaction: ButtonInteraction) => {
  const btn_id = interaction.customId;

  if (btn_id.startsWith("reminder:")) {
    return handle_rsvp(
      interaction,
      btn_id.split("reminder:")[1],
    );
  }

  return await interaction.reply({
    content: `⚠️ No interaction exists for this button.`,
    flags: MessageFlags.Ephemeral,
  });
};

export { handle_button_press };
