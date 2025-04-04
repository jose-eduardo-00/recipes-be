const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Ingredient = sequelize.define(
    "Ingredient",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      recipeId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "ingredients",
      timestamps: true,
      underscored: true,
      hooks: {},
    }
  );

  return Ingredient;
};
