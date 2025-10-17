"use strict";
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const p = path.join(__dirname, "data", "users.json");
    const list = JSON.parse(fs.readFileSync(p, "utf-8"));

    const rows = await Promise.all(
      list.map(async (u) => ({
        email: u.email,
        name: u.name || u.email.split("@")[0], 
        password: await bcrypt.hash(u.password, 10),
        role: u.role || "user", 
        createdAt: now,
        updatedAt: now,
      }))
    );

    if (rows.length) await queryInterface.bulkInsert("Users", rows, {});
  },

  async down(queryInterface) {
    const p = path.join(__dirname, "data", "users.json");
    const list = JSON.parse(fs.readFileSync(p, "utf-8"));
    const emails = list.map((u) => u.email);
    await queryInterface.bulkDelete("Users", { email: emails }, {});
  },
};
