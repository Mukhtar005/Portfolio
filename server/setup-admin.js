const path = require("path");
const bcrypt = require("bcryptjs");
const { initStore, verifyAdmin } = require("./store");

const args = process.argv.slice(2);
const username = args[0] || process.env.ADMIN_USERNAME;
const password = args[1] || process.env.ADMIN_PASSWORD;

if (!username || !password) {
  console.error("Использование: node server/setup-admin.js <логин> <пароль>");
  process.exit(1);
}

initStore();

const fs = require("fs");
const adminPath = path.join(__dirname, "..", "data", "admin.json");
const data = {
  username,
  passwordHash: bcrypt.hashSync(password, 10),
};

const dir = path.dirname(adminPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(adminPath, JSON.stringify(data, null, 2), "utf8");

if (verifyAdmin(username, password)) {
  console.log("Администратор настроен успешно");
} else {
  console.error("Ошибка проверки учётных данных");
  process.exit(1);
}
