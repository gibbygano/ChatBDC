interface WithCancellationOptions {
  key: string;
  timeoutMs: number;
}

class CancellationService {
  private static _instance: CancellationService;
  private timeouts = new Map<string, number>();

  private constructor() {}

  static get instance(): CancellationService {
    if (!CancellationService._instance) {
      CancellationService._instance = new CancellationService();
    }

    return CancellationService._instance;
  }

  withCancellation(
    callback: () => void,
    { key, timeoutMs }: WithCancellationOptions,
  ) {
    const timeout = setTimeout(() => {
      callback();
      this.timeouts.delete(key);
    }, timeoutMs);

    this.timeouts.set(key, timeout);
  }

  cancel(key: string) {
    clearTimeout(this.timeouts.get(key));
    this.timeouts.delete(key);
  }
}

export { CancellationService };
