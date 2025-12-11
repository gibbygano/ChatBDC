import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { QuoteCommand } from "@/command.pg.types.ts";
import commandsRepository from "@/repositories/commandsRepository.ts";

const execute = async (interaction: ChatInputCommandInteraction) => {
  const shit_carl_said = interaction.options.getString("shit_carl_said");
  const shit_carl_has_said = await commandsRepository.getCommand<QuoteCommand>(
    "carl",
    "gimmecarl",
  );

  if (shit_carl_has_said?.command.quotes.find((s) => s === shit_carl_said)) {
    return await interaction.reply({
      content: "Man, Carl already said that shit.",
      flags: MessageFlags.Ephemeral,
    });
  }
};

export { execute };
