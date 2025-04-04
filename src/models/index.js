"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

// ✅ Usa variáveis de ambiente do .env
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
    logging: false, // opcional, remove os logs SQL no console
  }
);

// 🔁 Função recursiva para buscar todos os arquivos .js nas subpastas de models
function loadModels(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadModels(fullPath); // recursivo
    } else if (
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.includes(".test.js")
    ) {
      const model = require(fullPath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });
}

loadModels(__dirname); // Carrega modelos de toda a pasta models

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const Recipe = require("./recipes/recipes")(sequelize, Sequelize.DataTypes);
const RecipeImage = require("./recipesImages/recipesImages")(
  sequelize,
  Sequelize.DataTypes
);
const RecipeStep = require("./recipeSteps/recipeSteps")(
  sequelize,
  Sequelize.DataTypes
);
const User = require("./user/user")(sequelize, Sequelize.DataTypes);
const Category = require("./categorys/categorys")(
  sequelize,
  Sequelize.DataTypes
);

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

module.exports = db;
