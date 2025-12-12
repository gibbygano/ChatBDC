import type { QuoteCommand } from "@/pg.types.ts";
import type { ChatInputCommandInteraction } from "discord.js";

import { MessageFlags } from "discord.js";
import { CommandRepository } from "@/repositories/commandRepository.ts";
import { PoolProvider } from "@/infrastructure/poolProvider.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const shit_carl_said = interaction.options.getString("shit_carl_said");
  const command_repository = new CommandRepository(PoolProvider.instance);
  const carl_command = await command_repository.getCommand<QuoteCommand>(
    "carl",
    "gimmecarl",
  );

  if (!shit_carl_said) {
    return await interaction.reply({
      content: "Man, Carl didn't say shit.",
      flags: MessageFlags.Ephemeral,
    });
  }

  console.log(carl_command);
  const existing_quotes = carl_command?.command.quotes;
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
    await command_repository.mergeCommand(
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
