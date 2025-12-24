export interface ICronService {
  runEveryMinutes(
    id: string,
    minutes: number,
    callback: () => Promise<void>,
  ): void;
}

export class CronService implements ICronService {
  runEveryMinutes(
    id: string,
    minutes: number,
    callback: () => Promise<void>,
  ): void {
    Deno.cron(id, `*/${minutes} * * * *`, callback);
  }
}
