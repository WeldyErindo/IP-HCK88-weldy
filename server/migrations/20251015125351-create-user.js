'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: { allowNull:false, autoIncrement:true, primaryKey:true, type:Sequelize.INTEGER },
      email: { type:Sequelize.STRING, allowNull:false, unique:true },
      password: { type:Sequelize.STRING, allowNull:false },
      createdAt: { allowNull:false, type:Sequelize.DATE, defaultValue:Sequelize.fn('NOW') },
      updatedAt: { allowNull:false, type:Sequelize.DATE, defaultValue:Sequelize.fn('NOW') }
    });

   
    await queryInterface.addIndex('Users', ['email'], { unique:true, name:'users_email_uq' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('Users', 'users_email_uq');
    await queryInterface.dropTable('Users');
  }
};
