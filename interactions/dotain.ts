import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";
import { ReminderService } from "@/services/reminderService.ts";
import { ReminderType } from "@/types.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const dota_minutes = interaction.options.getString("dota_minutes");

  if (!dota_minutes || isNaN(+dota_minutes)) {
    return await interaction.reply({
      content:
        "❌ Please provide a valid number (positive integer or decimal). ",
      flags: MessageFlags.Ephemeral,
    });
  }

  const reminder_service = ReminderService.instance;
  const reminder_id = reminder_service.createReminder(
    <GuildMember> interaction.member,
    ReminderType.DOTA,
    Math.abs(Number(dota_minutes)),
    interaction.channelId,
  );

  if (!reminder_id) {
    return await interaction.reply({
      content:
        `⚠️ Could not create Dota reminder. A current reminder for ${ReminderType.DOTA} exists.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  const dota_reminder_display = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(
          `## @dotaboi, <@${interaction.member?.user.id}> just created a roll call for Dota in **${dota_minutes} minutes**.`,
        ),
    )
    .addActionRowComponents((ar) =>
      ar.setComponents(
        new ButtonBuilder()
          .setCustomId(`reminder:${reminder_id}`)
          .setLabel("RSPV")
          .setStyle(ButtonStyle.Primary),
      )
    );

  return await interaction.reply({
    components: [dota_reminder_display],
    flags: MessageFlags.IsComponentsV2,
  });
};

export { execute };
