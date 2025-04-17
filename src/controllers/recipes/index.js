import Sequelize from "../../config/database.js";
import db from "../../models/index.js";

const { Recipe, RecipeCategory, RecipeIngredients, RecipeStep } = db;

export const createRecipe = async (req, res) => {
  const transaction = await Sequelize.transaction();

  try {
    const {
      name,
      desciption,
      userId,
      categorys,
      ingredients,
      preparationMethod,
    } = req.body;

    const newRecipe = await Recipe.create(
      {
        name,
        desciption,
        userId,
      },
      { transaction }
    );

    if (Array.isArray(categorys) && categorys.length > 0) {
      const categoryEntries = categorys.map((categoryId) => ({
        recipeId: newRecipe.id,
        categoryId,
      }));

      await RecipeCategory.bulkCreate(categoryEntries, { transaction });
    }

    // Cria os ingredientes (se houver)
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      const ingredientEntries = ingredients.map((ingredient) => ({
        recipeId: newRecipe.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));

      await RecipeIngredients.bulkCreate(ingredientEntries, { transaction });
    }

    // Cria os métodos de preparo (se houver)
    if (Array.isArray(preparationMethod) && preparationMethod.length > 0) {
      const methodEntries = preparationMethod.map((step) => ({
        recipeId: newRecipe.id,
        description: step.description,
        order: step.order,
      }));

      await RecipeStep.bulkCreate(methodEntries, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      message: "Receita criada com sucesso.",
      recipe: newRecipe,
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      message: "Erro ao tentar criar a receita",
      error: error.message,
    });
  }
};
