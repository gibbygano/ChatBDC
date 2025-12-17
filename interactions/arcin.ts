import type { ChatInputCommandInteraction, GuildMember } from "discord.js";

import {
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";
import { ReminderService } from "@/services/reminderService.ts";
import { ReminderType } from "@/types.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const arc_minutes = interaction.options.getString("minutes");

  if (!arc_minutes || isNaN(+arc_minutes)) {
    return await interaction.reply({
      content:
        "❌ Please provide a valid number (positive integer or decimal). ",
      flags: MessageFlags.Ephemeral,
    });
  }

  const reminder_service = ReminderService.instance;
  const reminder_id = reminder_service.createReminder(
    <GuildMember> interaction.member,
    ReminderType.ARC,
    Math.abs(Number(arc_minutes)),
    interaction.channelId,
  );

  if (!reminder_id) {
    return await interaction.reply({
      content:
        `⚠️ Could not create Arc reminder. A current reminder for ${ReminderType.ARC} exists.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  const arc_role = interaction.guild?.roles.cache.find((r) =>
    r.name === "rainerds"
  );
  const arc_reminder_display = new ContainerBuilder()
    .addSectionComponents(
      (section) =>
        section
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(
                `## <@&${arc_role?.id}>, <@${interaction.member?.user.id}> just created a roll call for Arc Raiders in **${arc_minutes} minutes**.`,
              ),
          )
          .setButtonAccessory((btn) =>
            btn.setCustomId(`reminder:${reminder_id}`)
              .setLabel("Wanna team up?")
              .setStyle(ButtonStyle.Primary)
          ),
    );

  return await interaction.reply({
    components: [arc_reminder_display],
    flags: MessageFlags.IsComponentsV2,
  });
};

export { execute };
