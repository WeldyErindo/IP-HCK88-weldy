
const r = require("express").Router();
const {
  register,
  login,
  googleLogin,
} = require("../controllers/authController");

r.post("/register", register);
r.post("/login", login);
r.post("/google", googleLogin);

module.exports = r;
