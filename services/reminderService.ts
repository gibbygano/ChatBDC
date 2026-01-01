import type { Reminder, ReminderRequest } from "@/types.ts";

import logger from "@logging";
import { QueueType } from "@/types.ts";
import { QueueService } from "./queueService.ts";
import { add_minutes, minutes_to_ms, now } from "@/utils/time.ts";

export interface IReminderSerivce {
  getReminder: (reminder_id: string) => Reminder | undefined;
  createReminder: (
    reminder_request: ReminderRequest,
    timespan_in_minutes: number,
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

    logger.log_info(
      "Enqueued reminder",
      JSON.stringify({ reminder_id, timespan_in_minutes }, null, 2),
    );
  }

  getReminder(reminder_id: string) {
    return this._reminders.get(reminder_id);
  }

  createReminder(
    reminder_request: ReminderRequest,
    timespan_in_minutes: number,
  ) {
    this.clearExpiredReminders();

    const matching_reminders = this._reminders.values()
      .filter((r) =>
        r.request.reminder_type === reminder_request.reminder_type
      );

    if (matching_reminders.some((r) => r)) {
      return;
    }

    const reminder_key =
      `${reminder_request.created_by_id}_${reminder_request.reminder_type}_${timespan_in_minutes}`;

    const timestamp = new Date();

    const reminder = {
      end_timestamp: add_minutes(timestamp, timespan_in_minutes),
      members: new Set<string>([reminder_request.created_by_id]),
      request: reminder_request,
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
