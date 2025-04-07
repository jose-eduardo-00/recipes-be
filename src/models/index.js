import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import RecipeModel from "./recipes/recipes.js";
import RecipeImageModel from "./recipesImages/recipesImages.js";
import RecipeStepModel from "./recipeSteps/recipeSteps.js";
import UserModel from "./user/user.js";
import CategoryModel from "./categorys/categorys.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

// Carrega os modelos automaticamente (caso ainda tenha outros em subpastas)
function loadModels(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadModels(fullPath);
    } else if (
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.includes(".test.js")
    ) {
      import(fullPath).then((module) => {
        const model = module.default(sequelize, DataTypes);
        db[model.name] = model;
      });
    }
  });
}

// Se quiser manter carregamento automático: loadModels(__dirname)

// Importa os modelos manualmente
const Recipe = RecipeModel(sequelize, DataTypes);
const RecipeImage = RecipeImageModel(sequelize, DataTypes);
const RecipeStep = RecipeStepModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Category = CategoryModel(sequelize, DataTypes);

db.Recipe = Recipe;
db.RecipeImage = RecipeImage;
db.RecipeStep = RecipeStep;
db.User = User;
db.Category = Category;

// Relacionamentos
Recipe.hasMany(RecipeImage, {
  as: "images",
  foreignKey: "recipeId",
  onDelete: "CASCADE",
});
RecipeImage.belongsTo(Recipe, { foreignKey: "recipeId" });

Recipe.hasMany(RecipeStep, {
  as: "steps",
  foreignKey: "recipeId",
  onDelete: "CASCADE",
});
RecipeStep.belongsTo(Recipe, { foreignKey: "recipeId" });

User.hasMany(Recipe, { foreignKey: "userId" });
Recipe.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Recipe, {
  foreignKey: "categoryId",
  as: "recipes",
  onDelete: "SET NULL",
});
Recipe.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
