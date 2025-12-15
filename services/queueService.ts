import { QueueType } from "@/types.ts";

export interface IQueueService {
  getQueue: () => Promise<Deno.Kv>;
}

export class QueueService implements IQueueService {
  private static _instance: QueueService;
  private _queue: Deno.Kv | undefined;

  private constructor() {}

  static get instance() {
    if (!QueueService._instance) {
      QueueService._instance = new QueueService();
    }

    return QueueService._instance;
  }

  async getQueue() {
    if (!this._queue) {
      this._queue = await Deno.openKv(":memory:");
    }

    return this._queue;
  }

  async registerListener<T>(
    queue_type: QueueType,
    callback: (id: string) => Promise<void>,
  ) {
    const queue = await this.getQueue();
    queue.listenQueue(async (args) => {
      if (
        args.type === queue_type
      ) {
        await callback(args.id);
      }
    });
  }
}
