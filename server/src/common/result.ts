export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
export type PResult<T, E> = Promise<Result<T, E>>;

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
