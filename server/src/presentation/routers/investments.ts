import { z } from "zod";
import { t, adminProcedure } from "../tRPC.js";
import { CreateInvestmentUseCase } from "../../application/use-cases/investments/CreateInvestmentUseCase.js";
import { GetInvestmentsUseCase } from "../../application/use-cases/investments/GetInvestmentsUseCase.js";
import { DeleteInvestmentUseCase } from "../../application/use-cases/investments/DeleteInvestmentUseCase.js";
import { investmentRepository } from "../tRPC.js";
import { CreateInvestmentSchema } from "../../application/dto/index.js";

const createInvestmentUseCase = new CreateInvestmentUseCase(investmentRepository);
const getInvestmentsUseCase = new GetInvestmentsUseCase(investmentRepository);
const deleteInvestmentUseCase = new DeleteInvestmentUseCase(investmentRepository);

export const investmentsRouter = t.router({
  list: adminProcedure.query(async () => {
    return getInvestmentsUseCase.execute();
  }),

  create: adminProcedure
    .input(CreateInvestmentSchema)
    .mutation(async ({ input }) => {
      return createInvestmentUseCase.execute(input);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return deleteInvestmentUseCase.execute(input.id);
    }),
});
