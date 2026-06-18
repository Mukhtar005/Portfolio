const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "app.js");
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

const indices = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === "const skillCategories = [") indices.push(i);
}

if (indices.length >= 2) {
  const fixed = [...lines.slice(0, indices[0]), ...lines.slice(indices[1])];
  fs.writeFileSync(file, fixed.join("\n"));
  console.log("Fixed: removed duplicate block at lines", indices[0] + 1, "-", indices[1]);
} else {
  console.log("No duplicate found", indices);
}
