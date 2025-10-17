import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import PublicMeals from "./pages/PublicMeals.jsx";
import Register from "./pages/Register.jsx";
import MealDetail from "./pages/MealDetail.jsx";
import Login from "./pages/Login.jsx";
import AddRecipe from "./pages/AddRecipe.jsx";
import MyRecipes from "./pages/MyRecipes.jsx";
import EditRecipe from "./pages/EditRecipe.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicMeals />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meal/:id" element={<MealDetail />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="/edit-recipe/:id" element={<EditRecipe />} />
      </Routes>
    </>
  );
}
