'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recipes', {
      id: { allowNull:false, autoIncrement:true, primaryKey:true, type:Sequelize.INTEGER },

      title: { type:Sequelize.STRING, allowNull:false },
      thumbnail: { type:Sequelize.STRING, allowNull:true },

   
      ingredients: { type:Sequelize.JSONB, allowNull:false, defaultValue:[] },

      instructions: { type:Sequelize.TEXT, allowNull:false },
      durationMinutes: { type:Sequelize.INTEGER, allowNull:true },
      sourceUrl: { type:Sequelize.STRING, allowNull:true },

      CategoryId: {
        type:Sequelize.INTEGER, allowNull:true,
        references:{ model:'Categories', key:'id' },
        onUpdate:'CASCADE', onDelete:'SET NULL'
      },
      UserId: {
        type:Sequelize.INTEGER, allowNull:true,
        references:{ model:'Users', key:'id' },
        onUpdate:'CASCADE', onDelete:'SET NULL'
      },

      createdAt: { allowNull:false, type:Sequelize.DATE, defaultValue:Sequelize.fn('NOW') },
      updatedAt: { allowNull:false, type:Sequelize.DATE, defaultValue:Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('Recipes', ['title'], { name:'recipes_title_idx' });
    await queryInterface.addIndex('Recipes', ['CategoryId'], { name:'recipes_category_idx' });
    await queryInterface.addIndex('Recipes', ['UserId'], { name:'recipes_user_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Recipes', 'recipes_user_idx');
    await queryInterface.removeIndex('Recipes', 'recipes_category_idx');
    await queryInterface.removeIndex('Recipes', 'recipes_title_idx');
    await queryInterface.dropTable('Recipes');
  }
};
