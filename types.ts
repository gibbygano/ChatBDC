import { ChatInputCommandInteraction } from "discord.js";

interface CommandData {
  id: string;
  application_id: string;
  version: string;
  default_member_permissions: unknown | null;
  type: number;
  name: string;
  name_localizations: string | null;
  description: string;
  description_localizations: string | null;
  guild_id: string | null;
  nsfw: boolean;
}

interface Command {
  data: CommandData;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
export type { Command, CommandData };
