import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { QuoteCommand } from "@/command.pg.types.ts";
import { CommandsRepository } from "@/repositories/commandsRepository.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const shit_carl_said = interaction.options.getString("shit_carl_said");
  const commands_repository = CommandsRepository.instance;
  const carl_commands = await commands_repository.getCommand<QuoteCommand>(
    "carl",
    "gimmecarl",
  );

  if (!shit_carl_said) {
    return await interaction.reply({
      content: "Man, Carl didn't say shit.",
      flags: MessageFlags.Ephemeral,
    });
  }

  const existing_quotes = carl_commands?.commands.quotes;
  if (
    existing_quotes &&
    existing_quotes.find((s) => s === shit_carl_said)
  ) {
    return await interaction.reply({
      content: "Man, Carl already said that shit.",
      flags: MessageFlags.Ephemeral,
    });
  }

  if (
    await commands_repository.mergeCommand(
      "carl",
      "gimmecarl",
      {
        quotes: existing_quotes
          ? [
            ...existing_quotes,
            shit_carl_said,
          ]
          : [shit_carl_said],
      },
    )
  ) {
    return await interaction.reply({
      content: `Got it. Carl said\n> ${shit_carl_said}`,
      flags: MessageFlags.Ephemeral,
    });
  }

  return await interaction.reply({
    content: "Couldn't add that to the list of shit Carl has said, sorry.",
    flags: MessageFlags.Ephemeral,
  });
};

export { execute };
