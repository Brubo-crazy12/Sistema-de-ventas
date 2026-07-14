import { IInvestmentRepository } from "../../../domain/interfaces/IInvestmentRepository.js";
import { Investment } from "../../../domain/entities/Investment.js";

export class GetInvestmentsUseCase {
  constructor(private investmentRepository: IInvestmentRepository) {}

  async execute(): Promise<Investment[]> {
    return this.investmentRepository.findAll();
  }

  async executeById(id: number): Promise<Investment | null> {
    return this.investmentRepository.findById(id);
  }

  async getTotal(): Promise<number> {
    return this.investmentRepository.getTotalInvestments();
  }
}
