import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { businessSettings } from "./schema.js";
import { IBusinessSettingsRepository } from "../../domain/interfaces/IBusinessSettingsRepository.js";
import { BusinessSettings } from "../../domain/entities/BusinessSettings.js";

function toDomain(row: any): BusinessSettings {
  return BusinessSettings.fromPersistence({
    id: row.id,
    userId: row.userId,
    businessName: row.businessName ?? "Mi Emprendimiento",
    email: row.email ?? "",
    currency: row.currency ?? "MXN",
    createdAt: row.createdAt ?? new Date(),
    updatedAt: row.updatedAt ?? new Date(),
  });
}

export class BusinessSettingsRepository implements IBusinessSettingsRepository {
  async findByUserId(userId: number): Promise<BusinessSettings | null> {
    const rows = await db.select().from(businessSettings).where(eq(businessSettings.userId, userId));
    return rows.length > 0 ? toDomain(rows[0]) : null;
  }

  async save(settings: BusinessSettings): Promise<BusinessSettings> {
    const existing = await this.findByUserId(settings.userId);
    if (existing) return this.update(settings.userId, settings);
    const rows = await db
      .insert(businessSettings)
      .values({
        userId: settings.userId,
        businessName: settings.businessName,
        email: settings.email,
        currency: settings.currency,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(userId: number, data: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const updateData: Record<string, any> = {};
    if (data.businessName !== undefined) updateData.businessName = data.businessName;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.currency !== undefined) updateData.currency = data.currency;
    updateData.updatedAt = new Date();
    const rows = await db
      .update(businessSettings)
      .set(updateData)
      .where(eq(businessSettings.userId, userId))
      .returning();
    return toDomain(rows[0]);
  }
}
