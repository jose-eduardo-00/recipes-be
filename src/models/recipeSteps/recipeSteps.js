const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RecipeSteps = sequelize.define(
    "RecipeSteps",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "recipe_steps",
      timestamps: true,
      underscored: true,
      hooks: {},
    }
  );

  return RecipeSteps;
};
