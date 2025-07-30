import { useEffect, useMemo, useState } from "react";
import { AppRootState } from "../../../core/redux/store";
import { useSelector } from "react-redux";
import { container } from "tsyringe";
import { AddCategoryUseCase, DeleteCategoryUseCase, GetAllCategoriesUseCase, UpdateCategoryUseCase } from "../../../domain/usecases/CategoryUseCases";
import Category from "../../../domain/models/Category";

export const useCategoryManagementViewModel = () => {
    const { user } = useSelector((state: AppRootState) => state.auth);
    const getAllCategoriesUseCase = useMemo(() => container.resolve(GetAllCategoriesUseCase), []);
    const addCategoryUseCase = useMemo(() => container.resolve(AddCategoryUseCase), []);
    const updateCategoryUseCase = useMemo(() => container.resolve(UpdateCategoryUseCase), []);
    const deleteCategoryUseCase = useMemo(() => container.resolve(DeleteCategoryUseCase), []);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState('#A020F0');

    useEffect(() => {
        if (!user) return;

        const unsubscribe = getAllCategoriesUseCase.execute(user.uid, (cats) => {
            setCategories(cats);
            setIsLoading(false);
        });
        return unsubscribe;

    }, [getAllCategoriesUseCase, user]);

    const openToAdd = () => {
        setEditingCategory(null);
        setName('');
        setColor('#A020F0');
        setModalVisible(true);
    };
    const openToEdit = (category: Category) => {
        setEditingCategory(category);
        setName(category.name);
        setColor(category.color);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!user || !name.trim()) return;
        const categoryData = { name, color, userId: user.uid };
        if (editingCategory) {
            await updateCategoryUseCase.execute({ ...categoryData, id: editingCategory.id });
        } else {
            await addCategoryUseCase.execute(categoryData);
        }
        setModalVisible(false);
    };

    const handleDelete = async (categoryId: string) => {
        await deleteCategoryUseCase.execute(categoryId);
    };

    return { categories, isLoading, isModalVisible, setModalVisible, editingCategory, name, setName, color, setColor, openToAdd, openToEdit, handleSave, handleDelete };
}