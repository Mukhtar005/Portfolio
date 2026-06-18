const siteSettings = {
  title: "Электронное портфолио",
  subtitle: "Студенты Колледжа ДГУ • Информационные системы и программирование",
  footerAuthor: "Гамзатов Мухтар",
};

const skillCategories = [
  {
    id: "languages",
    title: "Языки программирования",
    isGroup: true,
    subcategories: [
      { id: "python", title: "Python", skills: ["Python"] },
      { id: "java", title: "Java", skills: ["Java"] },
      { id: "csharp", title: "C#", skills: ["C#"] },
      { id: "cpp", title: "C++", skills: ["C++"] },
      { id: "javascript", title: "JavaScript", skills: ["JavaScript"] },
      { id: "php", title: "PHP", skills: ["PHP"] },
    ],
  },
  {
    id: "mobile",
    title: "Мобильная разработка",
    isGroup: true,
    subcategories: [
      { id: "android", title: "Android", skills: ["Android", "Kotlin"] },
      { id: "ios", title: "iOS", skills: ["iOS", "Swift"] },
      { id: "flutter", title: "Flutter", skills: ["Flutter"] },
    ],
  },
  {
    id: "web",
    title: "Веб-разработка",
    isGroup: true,
    subcategories: [
      {
        id: "frontend",
        title: "Фронтенд",
        skills: ["HTML", "CSS", "JavaScript", "React", "Vue"],
      },
      {
        id: "backend",
        title: "Бэкенд",
        skills: ["Node.js", "PHP", "Express", "PostgreSQL", "Django", "Laravel"],
      },
    ],
  },
  {
    id: "design",
    title: "Графический дизайн",
    isGroup: true,
    subcategories: [
      { id: "uiux", title: "UI/UX", skills: ["Figma", "UI/UX"] },
      { id: "graphic", title: "Графика", skills: ["Photoshop", "Adobe"] },
      { id: "video", title: "Видео", skills: ["Premiere Pro", "After Effects"] },
    ],
  },
];

module.exports = { skillCategories, siteSettings };
