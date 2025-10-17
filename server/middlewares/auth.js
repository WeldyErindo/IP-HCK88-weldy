const jwt = require("jsonwebtoken");
const db = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev");
    const user = await db.User.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch (e) {
    e.status = 401;
    next(e);
  }
};

const authorizeChef = (req, res, next) => {
  if (req.user.role !== "chef") {
    return res
      .status(403)
      .json({ error: "Access forbidden: Chef role required" });
  }
  next();
};

module.exports = { authenticate, authorizeChef };
