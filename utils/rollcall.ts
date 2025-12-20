import type { Reminder, ReminderRequest, ReminderType } from "@/types.ts";
import type { ChatInputCommandInteraction, TextChannel } from "discord.js";

import {
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
} from "discord.js";
import { ReminderService } from "@services";
import { remaining_to_string } from "./time.ts";

const handle_validation = async (
  interaction: ChatInputCommandInteraction,
  minutes: string | null,
) => {
  if (!minutes || isNaN(+minutes)) {
    await interaction.reply({
      content:
        "❌ Please provide a valid number (positive integer or decimal). ",
      flags: MessageFlags.Ephemeral,
    });

    return false;
  }

  if (Number(minutes) < 5) {
    await interaction.reply({
      content: "❌ Make it at least 5 minutes, please.",
      flags: MessageFlags.Ephemeral,
    });

    return false;
  }

  return true;
};

const create_reminder = async (
  interaction: ChatInputCommandInteraction,
  reminder_type: ReminderType,
  minutes: string | null,
  image_path: string,
  image_file: string,
  role_to_notify: string,
  rsvp_label: string,
) => {
  const is_valid = await handle_validation(interaction, minutes);
  if (!is_valid) {
    return;
  }

  const reminder_request: ReminderRequest = {
    created_by_id: interaction.user.id,
    reminder_type,
    channel_id: interaction.channelId,
    image_path,
    timestamp: new Date(),
    image_file,
  };

  const reminder_service = ReminderService.instance;
  const reminder_id = reminder_service.createReminder(
    reminder_request,
    Number(minutes),
  );

  if (!reminder_id) {
    return await interaction.reply({
      content:
        `⚠️ Could not create reminder. An active reminder for ${reminder_type} already exists.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  const role = interaction.guild?.roles.cache.find((r) =>
    r.name === role_to_notify
  );

  const reminder_display = new ContainerBuilder()
    .addSectionComponents(
      (section) =>
        section
          .addTextDisplayComponents(
            new TextDisplayBuilder()
              .setContent(
                `### <@&${role?.id}>, <@${interaction.member?.user.id}> just created a roll call for ${reminder_type} in **${minutes} minutes**.`,
              ),
          )
          .setButtonAccessory((btn) =>
            btn.setCustomId(`reminder:${reminder_id}`)
              .setLabel(rsvp_label)
              .setStyle(ButtonStyle.Primary)
          ),
    );

  return await interaction.reply({
    components: [reminder_display],
    flags: MessageFlags.IsComponentsV2,
  });
};

const notify = async (
  channel: TextChannel,
  at_time: boolean,
  reminder?: Reminder,
  remaining_time?: { minutes: number; seconds: number },
) => {
  const reminder_display = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(
          `### ${
            [
              ...reminder!.members.values().map((m) => `<@${m}>`),
            ]
              .join(
                " ",
              )
          }`,
        ),
    )
    .addSeparatorComponents((separator) => separator)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `# ${reminder!.request.reminder_type} ${
          at_time ? "time!" : `in **${remaining_to_string(remaining_time!)}**.`
        }`,
      ),
    );

  if (at_time) {
    reminder_display.addMediaGalleryComponents((mgc) =>
      mgc.addItems((mgi) =>
        mgi.setURL(`attachment://${reminder?.request.image_file}`)
      )
    );
  }

  return await channel.send({
    components: [reminder_display],
    flags: MessageFlags.IsComponentsV2,
    files: [reminder!.request.image_path],
  });
};

export { create_reminder, notify };
