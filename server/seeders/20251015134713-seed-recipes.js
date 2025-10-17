'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const p = path.join(__dirname, 'data', 'recipes.json');
    const list = JSON.parse(fs.readFileSync(p, 'utf-8'));
    if (!list.length) return;

    const [rows] = await queryInterface.sequelize.query(`
      SELECT
        format_type(a.atttypid, a.atttypmod) AS full_type,
        t.typname AS udt_name
      FROM pg_attribute a
      JOIN pg_class c ON a.attrelid = c.oid
      JOIN pg_namespace n ON c.relnamespace = n.oid
      JOIN pg_type t ON a.atttypid = t.oid
      WHERE n.nspname = 'public'
        AND c.relname = 'Recipes'
        AND a.attname = 'ingredients'
        AND a.attnum > 0
        AND NOT a.attisdropped
      LIMIT 1;
    `);

    const col = rows?.[0] || {};
    const fullType = String(col.full_type || '').toLowerCase(); 
    const isJsonb  = fullType.includes('jsonb') || col.udt_name === 'jsonb';
    const isTextArr = fullType.endsWith('[]') || col.udt_name.startsWith('_');

    // helper
    const toLine = (i) =>
      typeof i === 'string' ? i : `${i?.name ?? ''} — ${i?.amount ?? ''}`.trim().replace(/\s+—\s*$/, '');
    const escapeSql = (s) => s.replace(/'/g, "''");
    const toJsonbLiteral = (val) =>
      queryInterface.sequelize.literal(`'${escapeSql(JSON.stringify(val))}'::jsonb`);

    // map FK
    const [users] = await queryInterface.sequelize.query(`SELECT id, email FROM "Users";`);
    const [cats]  = await queryInterface.sequelize.query(`SELECT id, slug  FROM "Categories";`);
    const userIdByEmail = Object.fromEntries(users.map(u => [u.email, u.id]));
    const catIdBySlug   = Object.fromEntries(cats.map(c => [c.slug,  c.id]));

    const rowsToInsert = [];
    for (const r of list) {
      const CategoryId = catIdBySlug[r.categorySlug] ?? null;
      const UserId     = userIdByEmail[r.userEmail] ?? null;
      if (!CategoryId || !UserId) continue;

      let ingredientsValue;
      if (isJsonb) {
     
        ingredientsValue = toJsonbLiteral(r.ingredients || []);
      } else if (isTextArr) {
     
        ingredientsValue = (r.ingredients || []).map(toLine);
      } else {
        
        ingredientsValue = (r.ingredients || []).map(toLine).join('; ');
      }

      rowsToInsert.push({
        title: r.title,
        thumbnail: r.thumbnail || null,
        ingredients: ingredientsValue,
        instructions: r.instructions || '',
        durationMinutes: r.durationMinutes ?? null,
        sourceUrl: r.sourceUrl || null,
        CategoryId,
        UserId,
        createdAt: now,
        updatedAt: now
      });
    }

    if (rowsToInsert.length) {
      await queryInterface.bulkInsert('Recipes', rowsToInsert, {});
    }
  },

  async down(queryInterface) {
    const p = path.join(__dirname, 'data', 'recipes.json');
    const list = JSON.parse(fs.readFileSync(p, 'utf-8'));
    const titles = list.map(r => r.title);
    await queryInterface.bulkDelete('Recipes', { title: titles }, {});
  }
};
