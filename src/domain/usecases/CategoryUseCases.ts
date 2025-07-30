import { inject, injectable } from "tsyringe";
import Category from "../models/Category";
import type { ICategoryRepository } from "../repositories/ICategoryRepository";

@injectable() export class GetAllCategoriesUseCase{
    constructor(
        @inject('ICategoryRepository') private readonly categoryRepository: ICategoryRepository,
    ) { }

    execute(userId: string, onUpdate: (categories: Category[]) => void): () => void {
        return this.categoryRepository.getAllCategories(userId, onUpdate);
    }
}

@injectable()
export class AddCategoryUseCase {
    constructor(
        @inject('ICategoryRepository') private readonly categoryRepository: ICategoryRepository,
    ) { }

    execute(category: Category): Promise<string> {
        return this.categoryRepository.addCategory(category);
    }
}

@injectable()
export class UpdateCategoryUseCase {
    constructor(
        @inject('ICategoryRepository') private readonly categoryRepository: ICategoryRepository,
    ) { }

    execute(category: Category): Promise<void> {
        return this.categoryRepository.updateCategory(category);
    }
}

@injectable()
export class DeleteCategoryUseCase {
    constructor(
        @inject('ICategoryRepository') private readonly categoryRepository: ICategoryRepository,
    ) { }

    execute(categoryId: string): Promise<void> {
        return this.categoryRepository.deleteCategory(categoryId);
    }

}