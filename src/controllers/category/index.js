import { col, fn, where, Op } from "sequelize";
import db from "../../models/index.js";

const { Category } = db;

export const createCategory = async (req, res) => {
  try {
    const { name, userId } = req.body;

    const normalizedInput = name.trim().toLowerCase();

    const existingCategory = await Category.findOne({
      where: where(
        fn("LOWER", fn("REPLACE", col("name"), " ", "")),
        normalizedInput.replace(/\s+/g, "")
      ),
    });

    if (existingCategory) {
      return res.status(400).json({
        message: "Já existe uma categoria com esse nome.",
      });
    }

    const newUser = await Category.create({
      name,
      userId,
    });

    res.status(201).json({
      message: "Categoria criada com sucesso.",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar cadastrar a categoria",
      error: error.message,
    });
  }
};

export const allCategorys = async (req, res) => {
  try {
    const categorys = await Category.findAll();

    res.status(200).json({
      categorys: categorys,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar buscar as categorias.",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return res.status(400).json({
        message: "Categoria não encontrada",
      });
    }

    await category.destroy();

    res.status(200).json({
      message: "Categoria deletada com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao tentar buscar as categorias.",
      error: error.message,
    });
  }
};
