const db = require('../models');

exports.listCategories = async (req, res, next) => {
  try {
    const rows = await db.Category.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'slug']
    });
    res.json(rows);
  } catch (e) { next(e); }
};
