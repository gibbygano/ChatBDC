import type { ChatInputCommandInteraction, Message } from "discord.js";

enum ReminderType {
  DOTA = "Dota",
  ARC = "Arc Raiders",
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
  search_string: string;
  name: string;
  path: string;
  pathLabel: string;
}

interface Media {
  short_name: string;
  search_string: string;
  full_name: string;
  path: string;
  directory: MediaDirectory;
}

interface ReminderRequest {
  created_by_id: string;
  reminder_type: ReminderType;
  timestamp: Date;
  channel_id: string;
  image_path: string;
  image_file: string;
}

interface Reminder {
  members: Set<string>;
  end_timestamp: Date;
  request: ReminderRequest;
}

export type {
  Command,
  CommandData,
  Media,
  MediaDirectory,
  Reminder,
  ReminderRequest,
};
export { QueueType, ReminderType };
