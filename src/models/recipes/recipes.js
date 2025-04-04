const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Recipe = sequelize.define(
    "Recipe",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desciption: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recipe_relationship: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "recipes",
      timestamps: true,
      underscored: true,
      hooks: {},
    }
  );

  return Recipe;
};
