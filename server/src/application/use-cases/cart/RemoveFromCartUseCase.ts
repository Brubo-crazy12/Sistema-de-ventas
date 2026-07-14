import { ICartRepository } from "../../../domain/interfaces/ICartRepository.js";

export class RemoveFromCartUseCase {
  constructor(private cartRepository: ICartRepository) {}

  async execute(id: number): Promise<void> {
    const item = await this.cartRepository.findById(id);
    if (!item) {
      throw new Error("Cart item not found");
    }
    await this.cartRepository.delete(id);
  }

  async executeByUserId(userId: number): Promise<void> {
    await this.cartRepository.clearByUserId(userId);
  }
}
