import { BusinessSettings } from "../entities/BusinessSettings.js";

export interface IBusinessSettingsRepository {
  findByUserId(userId: number): Promise<BusinessSettings | null>;
  save(settings: BusinessSettings): Promise<BusinessSettings>;
  update(userId: number, data: Partial<BusinessSettings>): Promise<BusinessSettings>;
}
