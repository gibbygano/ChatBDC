import type { Reminder } from "@/types.ts";

import { GuildMember } from "discord.js";
import { QueueType, ReminderType } from "@/types.ts";
import { QueueService } from "./queueService.ts";
import { minutes_to_ms } from "../utils/time.ts";

export interface IReminderSerivce {
  getReminder: (reminder_id: string) => Reminder | undefined;
  createReminder: (
    member: GuildMember,
    reminder_type: ReminderType,
    timespan_in_minutes: number,
    channel_id: string,
  ) => string | undefined;
  joinReminder: (member: GuildMember, reminder_id: string) => boolean;
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

  private getTimespanEnd(timestamp: Date, timespan_in_minutes: number) {
    return new Date(
      timestamp.getTime() + timespan_in_minutes * 60000,
    );
  }

  private timeIsExpired(end_timestamp: Date) {
    return new Date() > end_timestamp;
  }

  private clearExpiredReminders() {
    for (const [id, reminder] of this._reminders) {
      const end_timestamp = this.getTimespanEnd(
        reminder.timestamp,
        reminder.timespan_in_minutes,
      );

      if (this.timeIsExpired(end_timestamp)) {
        this._reminders.delete(id);
      }
    }
  }

  async enqueue(reminder: Reminder, reminder_id: string) {
    const queue_service = QueueService.instance;

    (await queue_service.getQueue()).enqueue({
      type: QueueType.Reminder,
      payload: reminder,
      id: reminder_id,
    }, {
      delay: reminder.timespan_in_minutes < 5
        ? minutes_to_ms(reminder.timespan_in_minutes)
        : minutes_to_ms(5),
    });
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
      timespan_in_minutes,
      end_timestamp: this.getTimespanEnd(timestamp, timespan_in_minutes),
      reminder_type,
      created_by: member,
      members: new Set<GuildMember>([member]),
      channel_id,
    };

    this._reminders.set(reminder_key, reminder);
    this.enqueue(reminder, reminder_key);

    return reminder_key;
  }

  joinReminder(member: GuildMember, reminder_id: string) {
    const reminder = this._reminders.get(reminder_id);

    if (reminder) {
      reminder.members.add(member);

      return true;
    }

    return false;
  }

  deleteReminder(reminder_id: string) {
    this._reminders.delete(reminder_id);
  }
}
