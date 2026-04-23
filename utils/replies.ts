import type { BitFieldResolvable, Message } from "discord.js";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import logger from "@logging";
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
  /* The error handling is kind supurflous for the interaction types,
     but it doesn't hurt anything to let them live together in the try/catch */
  try {
    if (interaction instanceof ChatInputCommandInteraction) {
      return await (interaction as ChatInputCommandInteraction).reply({
        content: reply,
        flags: interaction_flags,
      });
    }

    return await (interaction as Message).reply({
      content: reply,
      flags: message_flags,
    });
  } catch (error) {
    logger.log_error(
      `Error replying to member`,
      JSON.stringify(
        {
          interaction,
          reply,
          flags: interaction_flags ?? message_flags,
          error,
        },
        null,
        3,
      ),
    );
  }
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

  try {
    if (interaction instanceof ChatInputCommandInteraction) {
      return await (interaction as ChatInputCommandInteraction).reply({
        content: reply,
        files,
        flags: interaction_flags,
      });
    }

    return await (interaction as Message).reply({
      content: reply,
      files,
      flags: message_flags,
    });
  } catch (error) {
    logger.log_error(
      `Error replying to member with file`,
      JSON.stringify(
        {
          interaction,
          reply,
          flags: interaction_flags ?? message_flags,
          error,
        },
        null,
        3,
      ),
    );
  }
};

export { handle_file_reply, handle_reply };
