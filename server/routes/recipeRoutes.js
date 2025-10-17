const r = require("express").Router();
const { authenticate, authorizeChef } = require("../middlewares/auth");
const {
  listRecipes,
  getMyRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");

r.get("/", listRecipes);
r.get("/my", authenticate, authorizeChef, getMyRecipes);
r.get("/:id", getRecipeById);
r.post("/", authenticate, authorizeChef, createRecipe);
r.put("/:id", authenticate, authorizeChef, updateRecipe);
r.delete("/:id", authenticate, authorizeChef, deleteRecipe);

module.exports = r;
