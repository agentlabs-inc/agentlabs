import { minutes } from 'src/common/ms-time';
import { Mutex } from 'src/common/mutex';

export interface ConversationMutexData {
  conversationId: string;
  lastReleasedAtTs: number | null;
  mutex: Mutex;
}

export class ConversationMutexManager {
  private readonly conversationIdToMutex = new Map<
    string,
    ConversationMutexData
  >();

  constructor() {
    const interval = setInterval(() => {
      this.cleanup();
    }, minutes(1));

    interval.unref();
  }

  private cleanup() {
    this.conversationIdToMutex.forEach(
      ({ lastReleasedAtTs, conversationId }) => {
        if (lastReleasedAtTs && Date.now() - lastReleasedAtTs > minutes(1)) {
          this.conversationIdToMutex.delete(conversationId);
        }
      },
    );
  }

  private getOrCreateMutex(conversationId: string): Mutex {
    let mutexData = this.conversationIdToMutex.get(conversationId);

    if (!mutexData) {
      mutexData = {
        conversationId,
        mutex: new Mutex({
          acquireRetryInterval: 10,
        }),
        lastReleasedAtTs: null,
      };
      this.conversationIdToMutex.set(conversationId, mutexData);
    }

    return mutexData.mutex;
  }

  async acquire(conversationId: string): Promise<void> {
    return this.getOrCreateMutex(conversationId).acquire();
  }

  async release(conversationId: string): Promise<void> {
    const data = this.conversationIdToMutex.get(conversationId);

    if (!data) {
      return;
    }

    data.mutex.release();
    data.lastReleasedAtTs = Date.now();
  }
}
