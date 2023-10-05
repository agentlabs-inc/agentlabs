export interface MutexConfig {
  acquireRetryInterval?: number;
}

export interface AcquireOptions {
  /**
   * If the mutex is not released after this amount of milliseconds, it will be released automatically.
   * This is useful to prevent deadlocks.
   * Good code should not have to rely on that, and it is advised to release the mutex in a finally block.
   * However, that accounts for the 0.1% of the cases where the mutex is not properly released.
   */
  autoReleaseAfterMs?: number;
}

export class Mutex {
  private idx = 0;
  private currentIdx = 0;
  private readonly acquireRetryInterval: number = 100;

  constructor(config: MutexConfig = { acquireRetryInterval: 100 }) {
    if (config.acquireRetryInterval) {
      this.acquireRetryInterval = config.acquireRetryInterval;
    }
  }

  /**
   * Returns a promise that resolves when the mutex is acquired.
   * No one will be able to acquire the mutex until a call to release() is made.
   * Acquisition requests are queued and processed in the order they are received.
   */
  async acquire(options: AcquireOptions = {}): Promise<void> {
    const idx = this.idx++;

    if (idx === this.currentIdx) {
      return;
    }

    return new Promise<void>((resolve) => {
      let totalWaitTime = 0;

      const interval = setInterval(() => {
        if (idx === this.currentIdx) {
          clearInterval(interval);
          resolve();
        }
        totalWaitTime += this.acquireRetryInterval;

        if (
          options.autoReleaseAfterMs &&
          totalWaitTime > options.autoReleaseAfterMs
        ) {
          this.release();
        }
      }, this.acquireRetryInterval ?? 100);
    });
  }

  release(): void {
    this.currentIdx += 1;
  }

  queueSize(): number {
    return this.idx - this.currentIdx;
  }
}
