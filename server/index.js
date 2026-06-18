const path = require("path");
const express = require("express");
const session = require("express-session");
const {
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
  addStudent,
  deleteStudent,
} = require("./store");

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "..");

app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.set("Pragma", "no-cache");
  next();
});

app.use(express.json({ limit: "2mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ep-portfolio-session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
  })
);

function requireAuth(req, res, next) {
  if (req.session?.admin) return next();
  res.status(401).json({ error: "Требуется авторизация" });
}

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Укажите логин и пароль" });
  }
  if (verifyAdmin(username, password)) {
    req.session.admin = username;
    return res.json({ ok: true, username, role: "admin" });
  }
  res.status(401).json({ error: "Неверный логин или пароль" });
});

app.post("/api/auth/student-login", (req, res) => {
  const { login, password } = req.body || {};
  if (!login || !password) {
    return res.status(400).json({ error: "Укажите логин и пароль" });
  }

  const students = getStudents();
  const student = students.find((s) => {
    const parts = s.name.split(" ");
    const lastName = parts[0] || "";
    const firstName = parts[1] || "";
    return (
      lastName.toLowerCase() === login.trim().toLowerCase() &&
      firstName.toLowerCase() === password.trim().toLowerCase()
    );
  });

  if (student) {
    const parts = student.name.split(" ");
    req.session.studentId = student.id;
    return res.json({
      ok: true,
      studentId: student.id,
      name: student.name,
      role: "student",
      firstName: parts[1],
      lastName: parts[0],
    });
  }

  res.status(401).json({ error: "Неверный логин или пароль" });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/auth/me", (req, res) => {
  if (req.session?.admin) {
    return res.json({ ok: true, username: req.session.admin, role: "admin" });
  }
  if (req.session?.studentId) {
    const student = getStudentById(req.session.studentId);
    if (student) {
      const parts = student.name.split(" ");
      return res.json({ 
        ok: true, 
        studentId: student.id, 
        name: student.name, 
        role: "student",
        firstName: parts[1],
        lastName: parts[0]
      });
    }
  }
  res.status(401).json({ error: "Не авторизован" });
});

app.get("/api/meta", (_req, res) => {
  res.json(getMeta());
});

app.put("/api/meta", requireAuth, (req, res) => {
  const current = getMeta();
  const updated = { ...current, ...req.body };
  saveMeta(updated);
  res.json(updated);
});

app.get("/api/status", (_req, res) => {
  res.json(getStatus());
});

app.get("/api/students", (_req, res) => {
  res.json(getStudents());
});

app.get("/api/students/:id", (req, res) => {
  const student = getStudentById(req.params.id);
  if (!student) return res.status(404).json({ error: "Студент не найден" });
  res.json(student);
});

app.put("/api/students/:id", requireAuth, (req, res) => {
  const existing = getStudentById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Студент не найден" });
  res.json(updateStudent(req.params.id, req.body));
});

app.put("/api/students/:id/grades/:course", requireAuth, (req, res) => {
  const existing = getStudentById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Студент не найден" });
  const grades = req.body.grades || req.body;
  res.json(updateGradesForCourse(req.params.id, req.params.course, grades));
});

app.put("/api/students/:id/portfolio", (req, res) => {
  const studentId = req.params.id;
  
  // Check if admin OR is student editing their own portfolio
  if (!req.session?.admin && !(req.session?.studentId && req.session.studentId === studentId)) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }
  
  const existing = getStudentById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Студент не найден" });
  res.json(updatePortfolio(req.params.id, req.body));
});

app.post("/api/students", requireAuth, (req, res) => {
  const newStudent = addStudent(req.body);
  res.json(newStudent);
});

app.delete("/api/students/:id", requireAuth, (req, res) => {
  const success = deleteStudent(req.params.id);
  if (!success) return res.status(404).json({ error: "Студент не найден" });
  res.json({ ok: true });
});

app.use(express.static(ROOT));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(ROOT, "index.html"));
});

initStore();

app.listen(PORT, () => {
  console.log(`Сервер: http://localhost:${PORT}`);
  console.log(`Админ:  http://localhost:${PORT}/admin.html`);
});
