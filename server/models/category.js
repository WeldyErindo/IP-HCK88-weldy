'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, { tableName: 'Categories' });

  Category.associate = (models) => {
    Category.hasMany(models.Recipe, { foreignKey: 'CategoryId' });
  };

  return Category;
};
