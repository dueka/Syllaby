// utils/auth.js
const bcrypt = require("bcrypt");

export async function hashPassword(password: any) {
  const saltRounds = 10; // The number of salt rounds affects the security (e.g., 10 rounds is a good default)
  return bcrypt.hash(password, saltRounds);
}

// module.exports = { hashPassword };
