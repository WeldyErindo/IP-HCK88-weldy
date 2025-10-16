

"use strict";
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      name: { type: DataTypes.STRING, allowNull: true },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [6, 255] },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          isIn: [["user", "chef"]],
        },
      },
    },
    {
      tableName: "Users",
      hooks: {
        beforeCreate: async (u) => {
          u.password = await bcrypt.hash(u.password, 10);
        },
      },
      defaultScope: { attributes: { exclude: ["password"] } },
      scopes: { withPassword: {} },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Recipe, { foreignKey: "UserId" });
  };

  return User;
};
