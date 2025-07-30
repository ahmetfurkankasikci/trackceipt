import Category from "../models/Category";

export interface ICategoryRepository {
    getAllCategories(userId:string,onUpdate:(categories:Category[])=>void):()=>void;
    addCategory(category:Category): Promise<void>;
    updateCategory(category:Category):Promise<void>;
    deleteCategory(categoryId:string):Promise<void>;
}