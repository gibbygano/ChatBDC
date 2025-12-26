export interface ICronService {
  runEveryMinutes(
    id: string,
    minutes: number,
    callback: () => Promise<void>,
    backoffSchedule?: number[],
  ): void;
}

export class CronService implements ICronService {
  runEveryMinutes(
    id: string,
    minutes: number,
    callback: () => Promise<void>,
    backoffSchedule?: number[],
  ): void {
    Deno.cron(id, `*/${minutes} * * * *`, {
      backoffSchedule,
    }, callback);
  }
}
