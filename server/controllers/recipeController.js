const db = require("../models");


const mapRecipe = (row) => {
  const r = row.toJSON ? row.toJSON() : row;
  r.image = r.thumbnail; 
  r.strMealThumb = r.thumbnail; 
  return r;
};

exports.listRecipes = async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const where = {};
    if (category) where.CategoryId = category;
    if (q)
      where.title = db.Sequelize.where(
        db.Sequelize.fn("LOWER", db.Sequelize.col("title")),
        "LIKE",
        `%${String(q).toLowerCase()}%`
      );

    const rows = await db.Recipe.findAll({
      where,
      include: [
        { model: db.Category, attributes: ["id", "name", "slug"] },
        { model: db.User, attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(rows.map(mapRecipe));
  } catch (e) {
    next(e);
  }
};

exports.getMyRecipes = async (req, res, next) => {
  try {
    const rows = await db.Recipe.findAll({
      where: { UserId: req.user.id },
      include: [
        { model: db.Category, attributes: ["id", "name", "slug"] },
        { model: db.User, attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(rows.map(mapRecipe));
  } catch (e) {
    next(e);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const row = await db.Recipe.findByPk(req.params.id, {
      include: [
        { model: db.Category, attributes: ["id", "name", "slug"] },
        { model: db.User, attributes: ["id", "name", "email"] },
      ],
    });
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(mapRecipe(row));
  } catch (e) {
    next(e);
  }
};

exports.createRecipe = async (req, res, next) => {
  try {
    const {
      title,
      thumbnail,
      area,
      ingredients,
      instructions,
      durationMinutes,
      sourceUrl,
      CategoryId,
    } = req.body;
    if (!title || !instructions)
      return res
        .status(400)
        .json({ error: "title & instructions are required" });

    const r = await db.Recipe.create({
      title,
      thumbnail: thumbnail || null,
      area: area || null,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      instructions,
      durationMinutes: durationMinutes ?? null,
      sourceUrl: sourceUrl || null,
      CategoryId: CategoryId ?? null,
      UserId: req.user.id,
    });

    res.status(201).json(mapRecipe(r));
  } catch (e) {
    next(e);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    const r = await db.Recipe.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    if (r.UserId !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    const {
      title,
      thumbnail,
      area,
      ingredients,
      instructions,
      durationMinutes,
      sourceUrl,
      CategoryId,
    } = req.body;
    await r.update({
      title: title ?? r.title,
      thumbnail: thumbnail ?? r.thumbnail,
      area: area ?? r.area,
      ingredients: Array.isArray(ingredients) ? ingredients : r.ingredients,
      instructions: instructions ?? r.instructions,
      durationMinutes: durationMinutes ?? r.durationMinutes,
      sourceUrl: sourceUrl ?? r.sourceUrl,
      CategoryId: CategoryId ?? r.CategoryId,
    });

    res.json(mapRecipe(r));
  } catch (e) {
    next(e);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    const r = await db.Recipe.findByPk(req.params.id);
    if (!r) return res.status(404).json({ error: "Not found" });
    if (r.UserId !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });
    await r.destroy();
    res.json({ message: "Deleted" });
  } catch (e) {
    next(e);
  }
};
