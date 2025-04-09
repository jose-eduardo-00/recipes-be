import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export default (sequelize) => {
  const AuthTokens = sequelize.define(
    "AuthTokens",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "auth_tokens",
      timestamps: true,
      underscored: true,
      hooks: {},
    }
  );

  return AuthTokens;
};
