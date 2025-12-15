import type { Reminder } from "@/types.ts";
import type { GuildMember } from "discord.js";

import { QueueType, ReminderType } from "@/types.ts";
import { QueueService } from "./queueService.ts";
import { add_minutes, minutes_to_ms, now } from "@/utils/time.ts";

export interface IReminderSerivce {
  getReminder: (reminder_id: string) => Reminder | undefined;
  createReminder: (
    member: GuildMember,
    reminder_type: ReminderType,
    timespan_in_minutes: number,
    channel_id: string,
  ) => string | undefined;
  joinReminder: (member_id: string, reminder_id: string) => boolean;
  deleteReminder: (reminder_id: string) => void;
}

export class ReminderService implements IReminderSerivce {
  private static _instance: ReminderService;
  private _reminders = new Map<string, Reminder>();

  private constructor() {}

  static get instance() {
    if (!ReminderService._instance) {
      ReminderService._instance = new ReminderService();
    }

    return ReminderService._instance;
  }

  private clearExpiredReminders() {
    for (const [id, { end_timestamp }] of this._reminders) {
      if (now() > end_timestamp) {
        this._reminders.delete(id);
      }
    }
  }

  async enqueue(timespan_in_minutes: number, reminder_id: string) {
    const queue_service = QueueService.instance;

    (await queue_service.getQueue()).enqueue({
      type: QueueType.Reminder,
      id: reminder_id,
    }, {
      delay: timespan_in_minutes <= 5
        ? minutes_to_ms(timespan_in_minutes)
        : minutes_to_ms(timespan_in_minutes - 5),
    });

    console.info(
      `Enqueued reminder ${reminder_id} with a delay of ${timespan_in_minutes} minute(s).`,
    );
  }

  getReminder(reminder_id: string) {
    return this._reminders.get(reminder_id);
  }

  createReminder(
    member: GuildMember,
    reminder_type: ReminderType,
    timespan_in_minutes: number,
    channel_id: string,
  ) {
    this.clearExpiredReminders();

    const matching_reminders = this._reminders.values()
      .filter((r) => r.reminder_type === reminder_type);

    if (matching_reminders.some((r) => r)) {
      return;
    }

    const reminder_key =
      `${member.user.id}_${reminder_type}_${timespan_in_minutes}`;

    const timestamp = new Date();

    const reminder = {
      timestamp,
      end_timestamp: add_minutes(timestamp, timespan_in_minutes),
      reminder_type,
      created_by_id: member.user.id,
      members: new Set<string>([member.id]),
      channel_id,
    };

    this._reminders.set(reminder_key, reminder);
    this.enqueue(timespan_in_minutes, reminder_key);

    return reminder_key;
  }

  joinReminder(member_id: string, reminder_id: string) {
    const reminder = this._reminders.get(reminder_id);

    if (reminder) {
      reminder.members.add(member_id);

      return true;
    }

    return false;
  }

  deleteReminder(reminder_id: string) {
    this._reminders.delete(reminder_id);
  }
}
