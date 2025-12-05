import type { ChatInputCommandInteraction } from "discord.js";
import { Events, MessageFlags } from "discord.js";
import commandService from "@/services/commandService.ts";

export default {
  name: Events.InteractionCreate,
  async execute(interaction: ChatInputCommandInteraction) {
    const command = commandService.commands.get(interaction.commandName);

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
