export class Either<L, R> {
  private constructor(
    private readonly isRightValue: boolean,
    private readonly left?: L,
    private readonly right?: R,
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(false, value, undefined);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(true, undefined, value);
  }

  isLeft(): boolean {
    return !this.isRightValue;
  }

  isRight(): boolean {
    return this.isRightValue;
  }

  getLeft(): L {
    if (this.isRightValue) {
      throw new Error('Cannot get left from a right either');
    }
    return this.left as L;
  }

  getRight(): R {
    if (!this.isRightValue) {
      throw new Error('Cannot get right from a left either');
    }
    return this.right as R;
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    return this.isRightValue ? Either.right<L, U>(fn(this.right as R)) : Either.left<L, U>(this.left as L);
  }

  mapLeft<U>(fn: (value: L) => U): Either<U, R> {
    return this.isRightValue ? Either.right<U, R>(this.right as R) : Either.left<U, R>(fn(this.left as L));
  }

  fold<U>(onLeft: (value: L) => U, onRight: (value: R) => U): U {
    return this.isRightValue ? onRight(this.right as R) : onLeft(this.left as L);
  }
}
