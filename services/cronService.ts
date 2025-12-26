export interface ICronService {
  runEveryNthMinute(
    id: string,
    minutes: number,
    callback: () => Promise<void>,
    backoffSchedule?: number[],
  ): void;
}

export class CronService implements ICronService {
  // Run on every nth minute of the hour. (Minutes divisible by N)
  // ie: 30 -> :00 and :30, 15 -> :00, :15, :30, :45
  // Anything >= 30 will only run once per hour on that minute.
  runEveryNthMinute(
    id: string,
    minute: number,
    callback: () => Promise<void>,
    backoffSchedule?: number[],
  ): void {
    Deno.cron(id, `*/${minute} * * * *`, {
      backoffSchedule,
    }, callback);
  }
}
