export abstract class ValueObject<T> {
  protected constructor(protected readonly props: T) {}

  public equals(other: ValueObject<T>): boolean {
    if (this.constructor !== other.constructor) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  public getProps(): T {
    return this.props;
  }
}
