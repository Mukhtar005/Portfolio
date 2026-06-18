const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { directionTitle, subjectsByCourse, buildGrades } = require("./constants");
const { rawStudents, portfolioData } = require("./seed-data");
const { skillCategories, siteSettings } = require("./meta-seed");

const DATA_DIR = path.join(__dirname, "..", "data");
const STUDENTS_PATH = path.join(DATA_DIR, "students.json");
const META_PATH = path.join(DATA_DIR, "meta.json");
const ADMIN_PATH = path.join(DATA_DIR, "admin.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  ensureDir();
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, filePath);
}

function defaultPortfolio(studentId) {
  const p = portfolioData[studentId];
  if (p) return { ...p };
  return {
    description: "Студент колледжа ДГУ.",
    skills: ["HTML", "CSS", "JavaScript", "Git"],
    strengths: ["Учёба"],
    achievements: ["Успеваемость"],
    projects: ["Курсовые проекты"],
  };
}

function buildStudentRecord(raw, index) {
  const gradesByCourse = {};
  for (let course = 1; course <= 4; course++) {
    gradesByCourse[course] = buildGrades(0, course, raw.type);
  }

  return {
    id: raw.id,
    name: raw.name,
    gender: raw.gender,
    group: raw.group,
    type: raw.type,
    phone: raw.phone,
    courseNow: 4,
    year: 2026,
    direction: directionTitle,
    studyForm: index % 3 === 0 ? "Заочная" : "Очная",
    studyBase: index % 5 === 0 ? "Платная" : "Бюджетная",
    gradesByCourse,
    portfolio: defaultPortfolio(raw.id),
  };
}

function seedStudents() {
  return rawStudents.map(buildStudentRecord);
}

function seedMeta() {
  return {
    directionTitle,
    subjectsByCourse,
    skillCategories,
    site: { ...siteSettings },
  };
}

function initDataFiles() {
  ensureDir();
  if (!fs.existsSync(STUDENTS_PATH)) {
    writeJson(STUDENTS_PATH, seedStudents());
    console.log("Создан data/students.json");
  }
  if (!fs.existsSync(META_PATH)) {
    writeJson(META_PATH, seedMeta());
    console.log("Создан data/meta.json");
  }
  if (!fs.existsSync(ADMIN_PATH)) {
    console.warn("Файл data/admin.json не найден — создайте его для входа в админ-панель");
  }
}

function getStudents() {
  return readJson(STUDENTS_PATH, []);
}

function saveStudents(students) {
  writeJson(STUDENTS_PATH, students);
}

function getStudentById(id) {
  return getStudents().find((s) => s.id === id) ?? null;
}

function getMeta() {
  return readJson(META_PATH, seedMeta());
}

function saveMeta(meta) {
  writeJson(META_PATH, meta);
}

function getAdmin() {
  return readJson(ADMIN_PATH, null);
}

function updateStudent(id, data) {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index < 0) return null;

  const current = students[index];
  const updated = {
    ...current,
    ...(data.name !== undefined && { name: data.name }),
    ...(data.gender !== undefined && { gender: data.gender }),
    ...(data.group !== undefined && { group: data.group }),
    ...(data.type !== undefined && { type: data.type }),
    ...(data.phone !== undefined && { phone: data.phone }),
    ...(data.courseNow !== undefined && { courseNow: data.courseNow }),
    ...(data.studyForm !== undefined && { studyForm: data.studyForm }),
    ...(data.studyBase !== undefined && { studyBase: data.studyBase }),
  };

  students[index] = updated;
  saveStudents(students);
  return updated;
}

function updateGradesForCourse(studentId, course, gradesMap) {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return null;

  const current = students[index];
  const courseKey = Number(course);
  const gradesByCourse = { ...current.gradesByCourse };
  const courseGrades = { ...(gradesByCourse[courseKey] || {}) };

  Object.entries(gradesMap).forEach(([subject, g]) => {
    courseGrades[subject] = {
      att1: g.att1 ?? "",
      att2: g.att2 ?? "",
      kur: g.kur ?? "",
      zach: g.zach ?? "",
      ekz: g.ekz ?? "",
    };
  });

  gradesByCourse[courseKey] = courseGrades;
  students[index] = { ...current, gradesByCourse };
  saveStudents(students);
  return students[index];
}

function updatePortfolio(studentId, portfolio) {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === studentId);
  if (index < 0) return null;

  const current = students[index];
  students[index] = {
    ...current,
    ...(portfolio.phone !== undefined && { phone: portfolio.phone }),
    portfolio: {
      description: portfolio.description ?? current.portfolio.description ?? "",
      skills: portfolio.skills ?? current.portfolio.skills ?? [],
      strengths: portfolio.strengths ?? current.portfolio.strengths ?? [],
      achievements: portfolio.achievements ?? current.portfolio.achievements ?? [],
      projects: portfolio.projects ?? current.portfolio.projects ?? [],
    },
  };

  saveStudents(students);
  return students[index];
}

function findStudentByCredentials(login, password) {
  const loginNorm = (login || "").trim().toLowerCase();
  const passNorm = (password || "").trim().toLowerCase();
  if (!loginNorm || !passNorm) return null;

  return getStudents().find((s) => {
    const parts = s.name.split(" ");
    const lastName = (parts[0] || "").toLowerCase();
    const firstName = (parts[1] || "").toLowerCase();
    return lastName === loginNorm && firstName === passNorm;
  }) ?? null;
}

function verifyAdmin(username, password) {
  const admin = getAdmin();
  if (!admin || admin.username !== username) return false;
  return admin.password === password;
}

function getStatus() {
  const students = getStudents();
  let gradeCount = 0;
  students.forEach((s) => {
    Object.values(s.gradesByCourse || {}).forEach((course) => {
      gradeCount += Object.keys(course).length;
    });
  });
  return {
    ok: true,
    storage: "JSON",
    file: "data/students.json",
    students: students.length,
    grades: gradeCount,
    time: new Date().toISOString(),
  };
}

function addStudent(studentData) {
  const students = getStudents();
  const newId = "s" + (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
  const defaultGrades = {};
  for (let c = 1; c <=4; c++) {
    defaultGrades[c] = {};
    const subjects = subjectsByCourse[c] || [];
    subjects.forEach(sub => {
      defaultGrades[c][sub] = { att1: '', att2: '', kur: '', zach: '', ekz: '' };
    });
  }
  const newStudent = {
    id: newId,
    name: studentData.name || "Новый студент",
    gender: studentData.gender || "m",
    group: studentData.group || "1",
    type: studentData.type || "good_plus",
    phone: studentData.phone || "+7 (XXX) XXX-XX-XX",
    courseNow: 4,
    year: 2026,
    direction: studentData.direction || directionTitle,
    studyForm: studentData.studyForm || "Очная",
    studyBase: studentData.studyBase || "Бюджетная",
    gradesByCourse: defaultGrades,
    portfolio: {
      skills: [],
      description: "",
      strengths: [],
      achievements: [],
      projects: []
    }
  };
  students.push(newStudent);
  saveStudents(students);
  return newStudent;
}

function deleteStudent(id) {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return false;
  saveStudents(filtered);
  return true;
}

function initStore() {
  initDataFiles();
}

module.exports = {
  initStore,
  getStudents,
  getStudentById,
  getMeta,
  saveMeta,
  updateStudent,
  updateGradesForCourse,
  updatePortfolio,
  verifyAdmin,
  getStatus,
  subjectsByCourse,
  addStudent,
  deleteStudent,
  seedStudents,
  findStudentByCredentials,
};
