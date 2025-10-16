const r = require("express").Router();
const { listCategories } = require("../controllers/categoryController");
const { generateRecipe } = require("../controllers/geminiController");

r.use("/auth", require("./authRoutes"));
r.use("/recipes", require("./recipeRoutes"));
r.get("/categories", listCategories);
r.post("/gemini/generate", generateRecipe);

module.exports = r;
