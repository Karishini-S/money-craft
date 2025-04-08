import { getUserCategories, getUserCategoriesByType, addUserCategory, deleteUserCategory } from "../models/categoryModel.js";

export const fetchCategories = async (req, res) => {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json({ message: "User not found in token" });
      }
      const { income, expense } = await getUserCategories(userId);
      //console.log("Categories found:", categories);

      res.status(200).json({ income, expense, assets: [] });
    } catch (error) {
      console.error("Error in fetchCategories:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

export const fetchCategoryByType = async (req, res) => {
    const userId = req.user.userId;
    const { type } = req.params;
    try {
        const result = await getUserCategoriesByType(userId, type);
        res.status(201).json(result);
    } catch (error) {

    }
}

export const addCategory = async (req, res) => {
    const { name, type } = req.body;
    const userId = req.user.userId;
    if (!name || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const result = await addUserCategory(userId, name, type);
        res.status(201).json(result[0]);
    } catch (error) {
      console.error("Error in adding a category: ", error.message);
      res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      });
    }
};

export const deleteCategory = async (req, res) => {
    const { name, type } = req.body;
    const userId = req.user.userId;
    try {
        const result = await deleteUserCategory(userId, name, type);
        if (result.length === 0) {
            return res.status(404).json({
                status: "failed",
                message: "Category not found"
            });
        }
        res.status(200).json({
            status: "success",
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleting a category: ", error.message);
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error"
        });
    }
};