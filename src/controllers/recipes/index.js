import db from "../../models/index.js";

const { Recipe, RecipeCategory } = db;

export const createRecipe = async (req, res) => {
  try {
    const { name, desciption, userId, categorys } = req.body;

    const newRecipe = await Recipe.create({
      name,
      desciption,
      userId,
    });

    if (Array.isArray(categorys) && categorys.length > 0) {
      const categoryEntries = categorys.map((categoryId) => ({
        recipeId: newRecipe.id,
        categoryId,
      }));

      await RecipeCategory.bulkCreate(categoryEntries);
    }

    res.status(201).json({
      message: "Receita criada com sucesso.",
      recipe: newRecipe,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar criar a receita",
      error: error.message,
    });
  }
};
