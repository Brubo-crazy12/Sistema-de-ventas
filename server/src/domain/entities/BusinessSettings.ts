export interface BusinessSettingsData {
  id: number;
  userId: number;
  businessName: string;
  email: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BusinessSettings {
  id!: number;
  userId!: number;
  businessName!: string;
  email!: string;
  currency!: string;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(data: BusinessSettingsData) {
    Object.assign(this, data);
  }

  static create(userId: number): BusinessSettings {
    return new BusinessSettings({
      id: 0,
      userId,
      businessName: "Mi Emprendimiento",
      email: "",
      currency: "MXN",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(data: BusinessSettingsData): BusinessSettings {
    return new BusinessSettings(data);
  }

  toJSON() {
    return { ...this };
  }
}
