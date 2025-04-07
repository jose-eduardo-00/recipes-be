import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pushToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "client"),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password") && user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // método customizado
  User.prototype.isPasswordValid = async function (password) {
    return bcrypt.compare(password, this.password || "");
  };

  return User;
};
