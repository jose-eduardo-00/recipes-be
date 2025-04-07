import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
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
