import type { BitFieldResolvable, Message } from "discord.js";
import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionsBitField,
} from "discord.js";
import { bold, italic, yellow } from "@coven/terminal";
import { Buffer } from "node:buffer";

const handle_reply = async (
  interaction: ChatInputCommandInteraction | Message,
  reply: string,
  interaction_flags?:
    | MessageFlags.Ephemeral
    | MessageFlags.SuppressEmbeds
    | MessageFlags.SuppressNotifications
    | MessageFlags.IsComponentsV2
    | "Ephemeral"
    | "SuppressEmbeds"
    | "SuppressNotifications"
    | "IsComponentsV2",
  message_flags?: BitFieldResolvable<
    "SuppressEmbeds" | "SuppressNotifications" | "IsComponentsV2",
    | MessageFlags.SuppressEmbeds
    | MessageFlags.SuppressNotifications
    | MessageFlags.IsComponentsV2
  >,
) => {
  if (interaction instanceof ChatInputCommandInteraction) {
    return await (interaction as ChatInputCommandInteraction).reply({
      content: reply,
      flags: interaction_flags,
    });
  }

  if (
    !interaction.guild?.members.me?.permissions.has(
      PermissionsBitField.Flags.ReadMessageHistory,
    )
  ) {
    console.warn(
      yellow`Can't reply to '${italic`${interaction.content}`}.' Client lacks ${bold`chat history`} permission.`,
    );
    return;
  }

  return await (interaction as Message).reply({
    content: reply,
    flags: message_flags,
  });
};

const handle_file_reply = async (
  interaction: ChatInputCommandInteraction | Message,
  reply: string,
  file: Uint8Array<ArrayBuffer>,
  file_name: string,
  interaction_flags?:
    | MessageFlags.Ephemeral
    | MessageFlags.SuppressEmbeds
    | MessageFlags.SuppressNotifications
    | MessageFlags.IsComponentsV2
    | "Ephemeral"
    | "SuppressEmbeds"
    | "SuppressNotifications"
    | "IsComponentsV2",
  message_flags?: BitFieldResolvable<
    "SuppressEmbeds" | "SuppressNotifications" | "IsComponentsV2",
    | MessageFlags.SuppressEmbeds
    | MessageFlags.SuppressNotifications
    | MessageFlags.IsComponentsV2
  >,
) => {
  const files = [{
    attachment: Buffer.from(file),
    name: file_name,
  }];

  if (interaction instanceof ChatInputCommandInteraction) {
    return await (interaction as ChatInputCommandInteraction).reply({
      content: reply,
      files,
      flags: interaction_flags,
    });
  }

  if (
    !interaction.guild?.members.me?.permissions.has(
      PermissionsBitField.Flags.ReadMessageHistory,
    )
  ) {
    console.warn(
      yellow`Can't reply to '${italic`${interaction.content}`}.' Client lacks ${bold`chat history`} permission.`,
    );
    return;
  }

  return (interaction as Message).reply({
    content: reply,
    files,
    flags: message_flags,
  });
};

export { handle_file_reply, handle_reply };
