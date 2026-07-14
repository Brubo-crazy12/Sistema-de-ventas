import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import { businessSettings } from "./schema.js";
import { IBusinessSettingsRepository } from "../../domain/interfaces/IBusinessSettingsRepository.js";
import { BusinessSettings } from "../../domain/entities/BusinessSettings.js";

function toDomain(row: any): BusinessSettings {
  return BusinessSettings.fromPersistence({
    id: row.id,
    userId: row.userId,
    sInvested: row.sInvested ?? 4900,
    sStock: row.sStock ?? 7,
    sCost: row.sCost ?? 700,
    pStockMl: row.pStockMl ?? 0,
    pStock10: row.pStock10 ?? 0,
    pStock30: row.pStock30 ?? 0,
    pStock60: row.pStock60 ?? 0,
    pStock100: row.pStock100 ?? 0,
    pCostMl: row.pCostMl ?? 2,
    pCost10: row.pCost10 ?? 15,
    pCost30: row.pCost30 ?? 25,
    pCost60: row.pCost60 ?? 35,
    pCost100: row.pCost100 ?? 45,
    pPrice10: row.pPrice10 ?? 120,
    pPrice30: row.pPrice30 ?? 205,
    pPrice60: row.pPrice60 ?? 295,
    pPrice100: row.pPrice100 ?? 420,
    pPriceRelleno: row.pPriceRelleno ?? 5,
    aInvested: row.aInvested ?? 0,
    aStock: row.aStock ?? 0,
    aCost: row.aCost ?? 0,
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
    if (existing) {
      return this.update(settings.userId, settings);
    }
    const rows = await db
      .insert(businessSettings)
      .values({
        userId: settings.userId,
        sInvested: settings.sInvested,
        sStock: settings.sStock,
        sCost: settings.sCost,
        pStockMl: settings.pStockMl,
        pStock10: settings.pStock10,
        pStock30: settings.pStock30,
        pStock60: settings.pStock60,
        pStock100: settings.pStock100,
        pCostMl: settings.pCostMl,
        pCost10: settings.pCost10,
        pCost30: settings.pCost30,
        pCost60: settings.pCost60,
        pCost100: settings.pCost100,
        pPrice10: settings.pPrice10,
        pPrice30: settings.pPrice30,
        pPrice60: settings.pPrice60,
        pPrice100: settings.pPrice100,
        pPriceRelleno: settings.pPriceRelleno,
        aInvested: settings.aInvested,
        aStock: settings.aStock,
        aCost: settings.aCost,
      })
      .returning();
    return toDomain(rows[0]);
  }

  async update(userId: number, data: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const updateData: Record<string, any> = {};
    const fields = [
      "sInvested", "sStock", "sCost", "pStockMl", "pStock10", "pStock30", "pStock60", "pStock100",
      "pCostMl", "pCost10", "pCost30", "pCost60", "pCost100",
      "pPrice10", "pPrice30", "pPrice60", "pPrice100", "pPriceRelleno",
      "aInvested", "aStock", "aCost",
    ];
    for (const field of fields) {
      if ((data as any)[field] !== undefined) {
        updateData[field] = (data as any)[field];
      }
    }
    updateData.updatedAt = new Date();
    const rows = await db
      .update(businessSettings)
      .set(updateData)
      .where(eq(businessSettings.userId, userId))
      .returning();
    return toDomain(rows[0]);
  }
}
