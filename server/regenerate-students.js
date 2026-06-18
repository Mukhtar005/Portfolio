const fs = require("fs");
const path = require("path");
const { initStore, seedStudents, saveStudents } = require("./store");

// Regenerate students.json
const students = seedStudents();
const studentsPath = path.join(__dirname, "..", "data", "students.json");
fs.writeFileSync(studentsPath, JSON.stringify(students, null, 2), "utf8");
console.log("data/students.json regenerated successfully!");
