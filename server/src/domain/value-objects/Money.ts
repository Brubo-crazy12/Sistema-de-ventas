export class Money {
  readonly amountInCents: number;

  private constructor(amountInCents: number) {
    this.amountInCents = amountInCents;
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) {
      throw new Error("Amount in cents must be an integer");
    }
    return new Money(cents);
  }

  static fromPesos(pesos: number): Money {
    if (pesos < 0) {
      throw new Error("Amount cannot be negative");
    }
    return new Money(Math.round(pesos * 100));
  }

  add(other: Money): Money {
    return new Money(this.amountInCents + other.amountInCents);
  }

  subtract(other: Money): Money {
    if (this.amountInCents < other.amountInCents) {
      throw new Error("Insufficient funds");
    }
    return new Money(this.amountInCents - other.amountInCents);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error("Factor cannot be negative");
    }
    return new Money(Math.round(this.amountInCents * factor));
  }

  toPesos(): number {
    return this.amountInCents / 100;
  }

  equals(other: Money): boolean {
    return this.amountInCents === other.amountInCents;
  }

  isGreaterThan(other: Money): boolean {
    return this.amountInCents > other.amountInCents;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.amountInCents >= other.amountInCents;
  }

  static zero(): Money {
    return new Money(0);
  }

  toString(): string {
    return `$${this.toPesos().toFixed(2)}`;
  }

  toJSON() {
    return {
      amountInCents: this.amountInCents,
      amountInPesos: this.toPesos(),
    };
  }
}
