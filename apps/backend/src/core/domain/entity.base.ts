export abstract class Entity<T extends { id: string }> {
  protected constructor(protected readonly props: T) {}

  get id(): string {
    return this.props.id;
  }

  public equals(other: Entity<T>): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.props.id === other.props.id;
  }

  public getProps(): T {
    return this.props;
  }
}
