
const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    
    const exists = await db.User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email already used" });

  
    const userRole = role === "chef" ? "chef" : "user";

    const user = await db.User.create({
      name,
      email,
      password,
      role: userRole,
    }); 

   
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    const u = await db.User.scope("withPassword").findOne({ where: { email } });
    if (!u) return res.status(401).json({ error: "Invalid email/password" });

    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ error: "Invalid email/password" });

    const token = jwt.sign(
      { id: u.id, email: u.email, name: u.name, role: u.role },
      process.env.JWT_SECRET || "dev",
      { expiresIn: "7d" }
    );
    res.json({
      access_token: token,
      user: { id: u.id, name: u.name, email: u.email, role: u.role },
    });
  } catch (e) {
    next(e);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { googleToken } = req.body;

    console.log("Google login attempt with token length:", googleToken?.length); // Debug

    if (!googleToken) {
      return res.status(400).json({ error: "Google token is required" });
    }

    console.log(
      "Verifying Google token with Client ID:",
      process.env.GOOGLE_CLIENT_ID
    ); 

    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    console.log("Google user email:", email, "name:", name); // Debug

    if (!email) {
      return res
        .status(400)
        .json({ error: "Email not found in Google account" });
    }

    let user = await db.User.findOne({ where: { email } });

    if (!user) {
      console.log("Creating new user from Google:", email); 
      const googleSecret =
        process.env.GOOGLE_CLIENT_SECRET || "google-oauth-secret";
      user = await db.User.create(
        {
          email,
          name: name || email.split("@")[0],
          password: googleSecret,
          role: "user",
        },
        { hooks: false }
      );
    } else {
      console.log("Existing user found:", email); 
    }

  
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || "dev",
      { expiresIn: "7d" }
    );

    console.log("Google login successful for:", email); 

    res.json({
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google login error details:", error.message); 
    console.error("Full error:", error);
    res.status(500).json({
      error: "Google authentication failed",
      details: error.message,
    });
  }
};
