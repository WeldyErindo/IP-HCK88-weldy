"use strict";
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    "Recipe",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      thumbnail: DataTypes.STRING,
      area: DataTypes.STRING,
      ingredients: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
      }, 
      instructions: { type: DataTypes.TEXT, allowNull: false },
      durationMinutes: DataTypes.INTEGER,
      sourceUrl: DataTypes.STRING,
    },
    { tableName: "Recipes" }
  );

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.Category, { foreignKey: "CategoryId" });
    Recipe.belongsTo(models.User, { foreignKey: "UserId" });
  };
  return Recipe;
};
