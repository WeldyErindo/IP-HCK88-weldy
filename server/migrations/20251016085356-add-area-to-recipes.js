"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Recipes", "area", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "thumbnail",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Recipes", "area");
  },
};
