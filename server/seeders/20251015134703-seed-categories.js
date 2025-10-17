'use strict';
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const p = path.join(__dirname, 'data', 'categories.json');
    const list = JSON.parse(fs.readFileSync(p, 'utf-8'));

    const rows = list.map((c) => ({
      name: c.name,
      slug: c.slug,
      createdAt: now,
      updatedAt: now
    }));

    if (rows.length) await queryInterface.bulkInsert('Categories', rows, {});
  },

  async down(queryInterface) {
  
    const p = path.join(__dirname, 'data', 'categories.json');
    const list = JSON.parse(fs.readFileSync(p, 'utf-8'));
    const slugs = list.map(c => c.slug);
    await queryInterface.bulkDelete('Categories', { slug: slugs }, {});
  }
};
