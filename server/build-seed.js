const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const rawMatch = src.match(/const rawStudents = \[([\s\S]*?)\];/);
const portMatch = src.match(/const portfolioData = \{([\s\S]*?)\};\s*\n\s*const students/);

const out = `function generateRussianPhone() {
  return "+7 (900) 000-00-00";
}

const rawStudents = [${rawMatch[1]}];

const portfolioData = {${portMatch[1]}};

module.exports = { rawStudents, portfolioData };
`;

fs.writeFileSync(path.join(__dirname, "seed-data.js"), out);
console.log("seed-data.js created");
