export class Quantity {
  readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  static create(value: number): Quantity {
    if (!Number.isInteger(value)) {
      throw new Error("Quantity must be an integer");
    }
    if (value < 0) {
      throw new Error("Quantity cannot be negative");
    }
    return new Quantity(value);
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    if (this.value < other.value) {
      throw new Error("Cannot subtract more than current quantity");
    }
    return new Quantity(this.value - other.value);
  }

  isGreaterThanOrEqual(other: Quantity): boolean {
    return this.value >= other.value;
  }

  isZero(): boolean {
    return this.value === 0;
  }

  static zero(): Quantity {
    return new Quantity(0);
  }

  toString(): string {
    return this.value.toString();
  }
}
