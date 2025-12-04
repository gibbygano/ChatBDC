interface WithCancellationOptions {
  key: string;
  timeoutMs: number;
}

class CancellationService {
  private timeouts = new Map<string, number>();

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

const instance = new CancellationService();

export default instance;
