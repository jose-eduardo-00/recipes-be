const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const RecipeImage = sequelize.define(
    "RecipeImage",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
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
      tableName: "recipe_images",
      timestamps: true,
      underscored: true,
      hooks: {},
    }
  );

  return RecipeImage;
};
