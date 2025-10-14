import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar.jsx";
import PublicMeals from "./pages/PublicMeals.jsx";
import Register from "./pages/Register.jsx";
import MealDetail from "./pages/MealDetail.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicMeals />} />
        <Route path="/register" element={<Register />} />
        <Route path="/meal/:id" element={<MealDetail />} />
      </Routes>
    </>
  );
}
