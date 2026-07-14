import { IInvestmentRepository } from "../../../domain/interfaces/IInvestmentRepository.js";
import { Investment } from "../../../domain/entities/Investment.js";
import { CreateInvestmentDTO } from "../../dto/CreateInvestmentDTO.js";

export class CreateInvestmentUseCase {
  constructor(private investmentRepository: IInvestmentRepository) {}

  async execute(data: CreateInvestmentDTO): Promise<Investment> {
    const investment = Investment.create({
      description: data.description,
      amount: data.amount,
      date: data.date ? new Date(data.date) : new Date(),
    });

    return this.investmentRepository.save(investment);
  }
}
