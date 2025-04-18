import Sequelize from "../../config/database.js";
import db from "../../models/index.js";

const { Recipe, RecipeCategory, RecipeIngredients, RecipeStep, RecipeImage } =
  db;

export const createRecipe = async (req, res) => {
  const transaction = await Sequelize.transaction();

  try {
    const { name, desciption, userId } = req.body;

    // ⚠️ Parse dos campos que vêm como JSON (enviados via FormData no frontend)
    const categorys = JSON.parse(req.body.categorys || "[]");
    const ingredients = JSON.parse(req.body.ingredients || "[]");
    const preparationMethod = JSON.parse(req.body.preparationMethod || "[]");

    const files = req.files;

    const newRecipe = await Recipe.create(
      {
        name,
        desciption,
        userId,
      },
      { transaction }
    );

    // Categorias
    if (Array.isArray(categorys) && categorys.length > 0) {
      const categoryEntries = categorys.map((categoryId) => ({
        recipeId: newRecipe.id,
        categoryId,
      }));

      await RecipeCategory.bulkCreate(categoryEntries, { transaction });
    }

    // Ingredientes
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      const ingredientEntries = ingredients.map((ingredient) => ({
        recipeId: newRecipe.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));

      await RecipeIngredients.bulkCreate(ingredientEntries, { transaction });
    }

    // Método de preparo
    if (Array.isArray(preparationMethod) && preparationMethod.length > 0) {
      const methodEntries = preparationMethod.map((step) => ({
        recipeId: newRecipe.id,
        description: step.description,
        order: step.order,
      }));

      await RecipeStep.bulkCreate(methodEntries, { transaction });
    }

    // Imagens
    if (files && files.length > 0) {
      const imageEntries = files.map((file, index) => ({
        recipeId: newRecipe.id,
        imageUrl: `/public/recipes/${file.filename}`, // ou `file.path` dependendo do seu setup
        order: index + 1,
      }));

      await RecipeImage.bulkCreate(imageEntries, { transaction });
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
