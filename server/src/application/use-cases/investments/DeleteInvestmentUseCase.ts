import { IInvestmentRepository } from "../../../domain/interfaces/IInvestmentRepository.js";

export class DeleteInvestmentUseCase {
  constructor(private investmentRepository: IInvestmentRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.investmentRepository.findById(id);
    if (!existing) {
      throw new Error("Investment not found");
    }
    await this.investmentRepository.delete(id);
  }
}
