import type {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
} from "discord.js";

enum ReminderType {
  DOTA = "Dota",
}

enum QueueType {
  Reminder = "reminder",
}

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

interface Reminder {
  created_by: GuildMember;
  members: Set<GuildMember>;
  reminder_type: ReminderType;
  timestamp: Date;
  timespan_in_minutes: number;
  end_timestamp: Date;
  channel_id: string;
}

export type { Command, CommandData, Media, MediaDirectory, Reminder };
export { QueueType, ReminderType };
