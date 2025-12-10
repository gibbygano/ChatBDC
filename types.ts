import { ChatInputCommandInteraction, Message } from "discord.js";

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

interface Command<T = ChatInputCommandInteraction | Message> {
  cooldown?: number;
  data: CommandData;
  execute: (interaction: T) => Promise<void>;
  autocomplete?: (interaction: T) => Promise<void>;
}

interface MediaDirectory {
  name: string;
  path: string;
  pathLabel: string;
}

interface Media {
  short_name: string;
  full_name: string;
  path: string;
  directory: MediaDirectory;
}

export type { Command, CommandData, Media, MediaDirectory };
