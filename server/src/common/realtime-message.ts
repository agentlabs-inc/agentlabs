export interface RealtimeMessagePayload<T> {
  data: T;
  timestamp: string;
  type: string;
  error: null | {
    code: string;
    message: string;
    context?: any;
  };
}

export interface RealtimeMessageError {
  code: string;
  message: string;
  context?: unknown;
}

export class RealtimeMessage<T> {
  public static fromPayload<T>(
    payload: RealtimeMessagePayload<T>,
  ): RealtimeMessage<T> {
    return new RealtimeMessage<T>(payload.type, payload.data, payload.error);
  }

  constructor(
    public readonly type: string,
    public readonly data: T,
    public readonly error: RealtimeMessageError | null = null,
  ) {}

  unwrap(): [object, RealtimeMessageError] | [T, null] {
    if (this.error) {
      return [{}, this.error];
    }

    return [this.data, null];
  }

  makePayload(): RealtimeMessagePayload<T> {
    return {
      timestamp: new Date().toISOString(),
      data: this.data,
      type: this.type,
      error: this.error,
    };
  }
}
