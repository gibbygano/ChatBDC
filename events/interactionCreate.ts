import type { ChatInputCommandInteraction } from "discord.js";

import { Events, MessageFlags } from "discord.js";
import logger from "@logging";
import { CommandService } from "@services";
import { handle_upload } from "@/utils/upload.ts";
import { handle_button_press } from "@/utils/button.ts";

export default {
  name: Events.InteractionCreate,
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.isModalSubmit()) {
      return handle_upload(interaction);
    }

    if (interaction.isButton()) {
      return handle_button_press(interaction);
    }

    const commands = await CommandService.instance.registerCommands();
    const command = commands.get(interaction.commandName);

    if (!command) {
      logger.log_error(
        `No matching command was found.`,
        interaction.commandName,
      );
      return;
    }

    if (interaction.isAutocomplete()) {
      try {
        if (command.autocomplete) {
          await command.autocomplete(interaction);
        }
      } catch (e) {
        logger.log_error(e);
      }
    }

    if (!interaction.isChatInputCommand()) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.log_error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
