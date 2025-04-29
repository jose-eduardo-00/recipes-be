import { Op } from "sequelize";
import Sequelize from "../../config/database.js";
import db from "../../models/index.js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  Recipe,
  RecipeCategory,
  RecipeIngredients,
  RecipeStep,
  RecipeImage,
  Category,
} = db;

export const createRecipe = async (req, res) => {
  const transaction = await Sequelize.transaction();

  try {
    const { name, desciption, userId } = req.body;

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

    if (Array.isArray(categorys) && categorys.length > 0) {
      const categoryEntries = categorys.map((categoryId) => ({
        recipeId: newRecipe.id,
        categoryId,
      }));

      await RecipeCategory.bulkCreate(categoryEntries, { transaction });
    }

    if (Array.isArray(ingredients) && ingredients.length > 0) {
      const ingredientEntries = ingredients.map((ingredient) => ({
        recipeId: newRecipe.id,
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));

      await RecipeIngredients.bulkCreate(ingredientEntries, { transaction });
    }

    if (Array.isArray(preparationMethod) && preparationMethod.length > 0) {
      const methodEntries = preparationMethod.map((step) => ({
        recipeId: newRecipe.id,
        description: step.description,
        order: step.order,
      }));

      await RecipeStep.bulkCreate(methodEntries, { transaction });
    }

    if (files && files.length > 0) {
      const imageEntries = files.map((file, index) => ({
        recipeId: newRecipe.id,
        imageUrl: `/public/recipes/${file.filename}`,
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

export const recipesById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipes = await Recipe.findAll({
      where: { userId: id },
      include: [
        {
          model: RecipeImage,
          as: "images",
        },
        {
          model: RecipeStep,
          as: "steps",
        },
        {
          model: RecipeIngredients,
          as: "ingredients",
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] }, // remove os dados da tabela intermediária
        },
      ],
    });

    res.status(200).json({
      recipes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar buscar as receitas.",
      error: error.message,
    });
  }
};

export const recipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipes = await Recipe.findByPk(id, {
      include: [
        {
          model: RecipeImage,
          as: "images",
        },
        {
          model: RecipeStep,
          as: "steps",
        },
        {
          model: RecipeIngredients,
          as: "ingredients",
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] }, // remove os dados da tabela intermediária
        },
      ],
    });

    res.status(200).json({
      recipes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar buscar as receitas.",
      error: error.message,
    });
  }
};

export const recommendedRecipes = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, recipeId } = req.body;

    const recipe = await Recipe.findByPk(recipeId, {
      include: [
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    if (!recipe) {
      return res.status(404).json({ message: "Receita base não encontrada." });
    }

    const categoryIds = recipe.categories.map((category) => category.id);

    const whereClause = {
      id: { [Op.ne]: recipeId },
    };

    if (userId === id) {
      whereClause.userId = { [Op.ne]: id };
    }

    const recipes = await Recipe.findAll({
      where: whereClause,
      include: [
        {
          model: RecipeImage,
          as: "images",
        },
        {
          model: RecipeStep,
          as: "steps",
        },
        {
          model: RecipeIngredients,
          as: "ingredients",
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
          where: {
            id: {
              [Op.in]: categoryIds,
            },
          },
          required: true,
        },
      ],
    });

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar buscar as receitas recomendadas.",
      error: error.message,
    });
  }
};

export const updateRecipe = async (req, res) => {
  const transaction = await Sequelize.transaction();

  try {
    const recipeId = req.params.id;
    const { name, desciption } = req.body;

    const categorys = JSON.parse(req.body.categorys || "[]");
    const ingredients = JSON.parse(req.body.ingredients || "[]");
    const preparationMethod = JSON.parse(req.body.preparationMethod || "[]");
    const existingImages = JSON.parse(req.body.existingImages || "[]");

    const files = req.files;

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }

    await recipe.update({ name, desciption }, { transaction });

    await RecipeCategory.destroy({ where: { recipeId }, transaction });

    if (Array.isArray(categorys) && categorys.length > 0) {
      const categoryEntries = categorys.map((categoryId) => ({
        recipeId,
        categoryId,
      }));
      await RecipeCategory.bulkCreate(categoryEntries, { transaction });
    }

    await RecipeIngredients.destroy({ where: { recipeId }, transaction });

    if (Array.isArray(ingredients) && ingredients.length > 0) {
      const ingredientEntries = ingredients.map((ingredient) => ({
        recipeId,
        name: ingredient.name,
        quantity: ingredient.quantity,
      }));
      await RecipeIngredients.bulkCreate(ingredientEntries, { transaction });
    }

    await RecipeStep.destroy({ where: { recipeId }, transaction });

    if (Array.isArray(preparationMethod) && preparationMethod.length > 0) {
      const methodEntries = preparationMethod.map((step) => ({
        recipeId,
        description: step.description,
        order: step.order,
      }));
      await RecipeStep.bulkCreate(methodEntries, { transaction });
    }

    const parsedExistingImageIds = existingImages.map((image) => image.id);

    if ((files && files.length > 0) || existingImages.length > 0) {
      const oldImages = await RecipeImage.findAll({
        where: { recipeId },
        order: [["createdAt", "ASC"]],
      }); // Ordenar por data de criação

      // Remover imagens antigas que não estão em existingImages
      for (const img of oldImages) {
        if (!parsedExistingImageIds.includes(img.id)) {
          const filePath = path.join(__dirname, "../../../", img.imageUrl);

          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Imagem removida do disco: ${filePath}`);
            }
          } catch (err) {
            console.error(`Erro ao remover imagem: ${filePath}`, err);
          }

          await RecipeImage.destroy({ where: { id: img.id }, transaction });
          console.log(`Imagem removida do banco: ${img.id}`);
        }
      }

      // Recalcular os "order" das imagens restantes (para manter a sequência)
      const allImages = [...existingImages, ...files]; // Juntar as imagens existentes com as novas
      const orderedImages = allImages.map((item, index) => ({
        ...item,
        order: index + 1, // O "order" sempre começa de 1
      }));

      // Atualizar a ordem no banco de dados (somente para imagens que já têm um "id")
      for (const image of orderedImages) {
        if (image.id) {
          // Verifica se a imagem tem um "id" válido
          await RecipeImage.update(
            { order: image.order },
            { where: { id: image.id }, transaction }
          );
        }
      }

      // Inserir as novas imagens (as imagens do "files" não têm "id" ainda, então, precisam ser inseridas)
      if (files && files.length > 0) {
        const imageEntries = files.map((file, index) => ({
          recipeId,
          imageUrl: `/public/recipes/${file.filename}`,
          order: existingImages.length + index + 1, // Continua a ordenação após as existentes
        }));

        await RecipeImage.bulkCreate(imageEntries, { transaction });
        console.log(`Novas imagens inseridas com os orders corretos.`);
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Receita atualizada com sucesso.",
      recipe,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      message: "Erro ao atualizar a receita",
      error: error.message,
    });
  }
};
