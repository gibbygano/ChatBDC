import type { ChatInputCommandInteraction } from "discord.js";

import { Events, MessageFlags } from "discord.js";
import { CommandService } from "@/services/commandService.ts";
import { handle_upload } from "@/utils/upload.ts";

export default {
  name: Events.InteractionCreate,
  async execute(interaction: ChatInputCommandInteraction) {
    if (interaction.isModalSubmit()) {
      return handle_upload(interaction);
    }

    const commands = await CommandService.instance.registerCommands();
    const command = commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    if (interaction.isAutocomplete()) {
      try {
        if (command.autocomplete) {
          await command.autocomplete(interaction);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (!interaction.isChatInputCommand()) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
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
