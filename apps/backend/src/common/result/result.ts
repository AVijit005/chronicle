export class Result<T, E = Error> {
  private constructor(
    private readonly ok: boolean,
    private readonly value?: T,
    private readonly error?: E,
  ) {}

  static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  static failure<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  isSuccess(): boolean {
    return this.ok;
  }

  isFailure(): boolean {
    return !this.ok;
  }

  getValue(): T {
    if (!this.ok) {
      throw new Error('Cannot get value from a failed result');
    }
    return this.value as T;
  }

  getError(): E {
    if (this.ok) {
      throw new Error('Cannot get error from a successful result');
    }
    return this.error as E;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return this.ok ? Result.success<U, E>(fn(this.value as T)) : Result.failure<U, E>(this.error as E);
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    return this.ok ? Result.success<T, F>(this.value as T) : Result.failure<T, F>(fn(this.error as E));
  }

  fold<U>(onSuccess: (value: T) => U, onFailure: (error: E) => U): U {
    return this.ok ? onSuccess(this.value as T) : onFailure(this.error as E);
  }
}
