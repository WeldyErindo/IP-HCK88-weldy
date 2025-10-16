'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      id: { allowNull:false, autoIncrement:true, primaryKey:true, type:Sequelize.INTEGER },
      name: { type:Sequelize.STRING, allowNull:false, unique:true },
      slug: { type:Sequelize.STRING, allowNull:false, unique:true },
      createdAt: { allowNull:false, type:Sequelize.DATE, defaultValue:Sequelize.fn('NOW') },
      updatedAt: { allowNull:false, type:Sequelize.DATE, defaultValue:Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('Categories', ['slug'], { unique:true, name:'categories_slug_uq' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Categories', 'categories_slug_uq');
    await queryInterface.dropTable('Categories');
  }
};
