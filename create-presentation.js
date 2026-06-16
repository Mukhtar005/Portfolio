const pptxgen = require("pptxgenjs");
const path = require("path");

const BG = "1E3A5F";
const ACCENT = "2E86AB";
const TEXT = "FFFFFF";
const SUBTEXT = "D6E8F5";

const FONT = "Arial";

function addSlideTitle(slide, title) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.9,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  });
  slide.addText(title, {
    x: 0.5,
    y: 0.15,
    w: 9,
    h: 0.6,
    fontFace: FONT,
    fontSize: 28,
    bold: true,
    color: TEXT,
  });
}

function addBullets(slide, items, y = 1.2) {
  const text = items.map((item) => ({
    text: item,
    options: { bullet: true, breakLine: true },
  }));
  slide.addText(text, {
    x: 0.6,
    y,
    w: 8.8,
    h: 4.5,
    fontFace: FONT,
    fontSize: 20,
    color: TEXT,
    valign: "top",
    paraSpaceAfter: 10,
  });
}

function setBg(slide) {
  slide.background = { color: BG };
}

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";
pptx.author = "Гамзатов Мухтар Ибадуллаевич";
pptx.title = "Платформа портфолио выпускников колледжа";
pptx.subject = "Дипломная работа СПО";

// Slide 1 — Title
{
  const slide = pptx.addSlide();
  setBg(slide);
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.15,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  });
  slide.addText(
    "Федеральное государственное бюджетное\nобразовательное учреждение высшего образования\n«Дагестанский государственный университет»",
    {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1.2,
      fontFace: FONT,
      fontSize: 18,
      color: SUBTEXT,
      align: "center",
    }
  );
  slide.addText("КОЛЛЕДЖ", {
    x: 0.5,
    y: 1.6,
    w: 9,
    h: 0.5,
    fontFace: FONT,
    fontSize: 22,
    bold: true,
    color: TEXT,
    align: "center",
  });
  slide.addText("Дипломная работа", {
    x: 0.5,
    y: 2.3,
    w: 9,
    h: 0.4,
    fontFace: FONT,
    fontSize: 20,
    color: SUBTEXT,
    align: "center",
  });
  slide.addText("Платформа портфолио выпускников колледжа", {
    x: 0.5,
    y: 2.9,
    w: 9,
    h: 0.8,
    fontFace: FONT,
    fontSize: 30,
    bold: true,
    color: TEXT,
    align: "center",
  });
  slide.addText("09.02.07 Информационные системы и программирование", {
    x: 0.5,
    y: 3.7,
    w: 9,
    h: 0.4,
    fontFace: FONT,
    fontSize: 18,
    color: SUBTEXT,
    align: "center",
  });
  slide.addText(
    "Выполнил: студент 4 курса\nГамзатов Мухтар Ибадуллаевич\n\nНаучный руководитель: Гафуров С.Г.",
    {
      x: 0.5,
      y: 4.3,
      w: 9,
      h: 1.2,
      fontFace: FONT,
      fontSize: 20,
      color: TEXT,
      align: "center",
    }
  );
  slide.addText("Махачкала — 2026", {
    x: 0.5,
    y: 5.2,
    w: 9,
    h: 0.4,
    fontFace: FONT,
    fontSize: 18,
    color: SUBTEXT,
    align: "center",
  });
}

// Slide 2 — Актуальность и обоснование темы
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Актуальность и обоснование темы");
  addBullets(slide, [
    "Рынок труда требует подтверждённого практического опыта выпускников СПО",
    "Достижения студентов хранятся разрозненно — без единой цифровой среды",
    "Необходима платформа колледжа для верификации и презентации компетенций",
  ]);
}

// Slide 3 — Цель и задачи
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Цель и задачи проекта");
  slide.addText("Цель:", {
    x: 0.6,
    y: 1.1,
    w: 8.8,
    h: 0.4,
    fontFace: FONT,
    fontSize: 22,
    bold: true,
    color: ACCENT,
  });
  slide.addText(
    "Проектирование и реализация веб-платформы портфолио выпускников колледжа",
    {
      x: 0.6,
      y: 1.5,
      w: 8.8,
      h: 0.6,
      fontFace: FONT,
      fontSize: 20,
      color: TEXT,
    }
  );
  slide.addText("Задачи:", {
    x: 0.6,
    y: 2.2,
    w: 8.8,
    h: 0.4,
    fontFace: FONT,
    fontSize: 22,
    bold: true,
    color: ACCENT,
  });
  addBullets(
    slide,
    [
      "Исследовать предметную область и проанализировать аналоги",
      "Сформулировать требования и спроектировать архитектуру",
      "Реализовать интерфейс, функционал и руководство пользователя",
    ],
    2.6
  );
}

// Slide 4 — Объект, предмет, методы
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Объект, предмет и методы исследования");
  addBullets(slide, [
    "Объект: процесс накопления и презентации достижений студентов в цифровой среде колледжа",
    "Предмет: методы, алгоритмы и программные средства веб-платформы портфолио",
    "Методы: анализ, сравнение, проектирование, программирование, тестирование",
  ]);
}

// Slide 5 — Инструментальные средства
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Инструментальные средства разработки");
  const rows = [
    [
      { text: "Категория", options: { bold: true, color: TEXT, fill: { color: ACCENT } } },
      { text: "Технология", options: { bold: true, color: TEXT, fill: { color: ACCENT } } },
    ],
    ["Язык", "JavaScript (ES6+)"],
    ["Разметка и стили", "HTML5, CSS3 (Flexbox, Grid)"],
    ["Среда разработки", "Visual Studio Code, Git"],
    ["Хранение данных", "JSON, встроенные структуры данных"],
  ];
  slide.addTable(rows, {
    x: 0.6,
    y: 1.2,
    w: 8.8,
    colW: [3.2, 5.6],
    fontFace: FONT,
    fontSize: 18,
    color: TEXT,
    border: { type: "solid", color: ACCENT, pt: 1 },
    fill: { color: "254060" },
  });
}

// Slide 6 — Спецификация приложения
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Спецификация приложения");
  addBullets(slide, [
    "SPA-приложение «Электронное портфолио» (ЭП) без перезагрузки страниц",
    "Три модуля: Главная, Успеваемость, Электронное портфолио",
    "Ролевая модель: студент, преподаватель, администратор, работодатель",
  ]);
  slide.addText("Направление: 09.02.07 — Информационные системы и программирование", {
    x: 0.6,
    y: 4.5,
    w: 8.8,
    h: 0.5,
    fontFace: FONT,
    fontSize: 18,
    italic: true,
    color: SUBTEXT,
  });
}

// Slide 7 — Результаты проектирования (архитектура)
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Результаты проектирования");
  slide.addText("Архитектура платформы (3 уровня):", {
    x: 0.6,
    y: 1.1,
    w: 8.8,
    h: 0.4,
    fontFace: FONT,
    fontSize: 20,
    bold: true,
    color: ACCENT,
  });
  const archRows = [
    [
      { text: "Уровень", options: { bold: true, color: TEXT, fill: { color: ACCENT } } },
      { text: "Назначение", options: { bold: true, color: TEXT, fill: { color: ACCENT } } },
    ],
    ["Представление", "Интерфейс: навигация, карточки, модальные окна"],
    ["Бизнес-логика", "Генерация оценок, портфолио, поиск и фильтрация"],
    ["Данные", "Массивы студентов, дисциплин, достижений"],
  ];
  slide.addTable(archRows, {
    x: 0.6,
    y: 1.6,
    w: 8.8,
    colW: [2.5, 6.3],
    fontFace: FONT,
    fontSize: 17,
    color: TEXT,
    border: { type: "solid", color: ACCENT, pt: 1 },
    fill: { color: "254060" },
  });
  slide.addText("Паттерн MVC — разделение данных, логики и представления", {
    x: 0.6,
    y: 4.8,
    w: 8.8,
    h: 0.4,
    fontFace: FONT,
    fontSize: 18,
    color: SUBTEXT,
  });
}

// Slide 8 — Интерфейс приложения
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Интерфейс приложения");
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 1.1,
    w: 2.8,
    h: 3.8,
    fill: { color: "254060" },
    line: { color: ACCENT, pt: 2 },
    rectRadius: 0.1,
  });
  slide.addText("Главная\n\n• Приветствие\n• Быстрый доступ\n• О колледже", {
    x: 0.65,
    y: 1.3,
    w: 2.5,
    h: 3.4,
    fontFace: FONT,
    fontSize: 16,
    color: TEXT,
    valign: "top",
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 3.6,
    y: 1.1,
    w: 2.8,
    h: 3.8,
    fill: { color: "254060" },
    line: { color: ACCENT, pt: 2 },
    rectRadius: 0.1,
  });
  slide.addText("Успеваемость\n\n• Поиск студентов\n• Таблица оценок\n• Модальное окно", {
    x: 3.75,
    y: 1.3,
    w: 2.5,
    h: 3.4,
    fontFace: FONT,
    fontSize: 16,
    color: TEXT,
    valign: "top",
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 6.7,
    y: 1.1,
    w: 2.8,
    h: 3.8,
    fill: { color: "254060" },
    line: { color: ACCENT, pt: 2 },
    rectRadius: 0.1,
  });
  slide.addText("Портфолио\n\n• Карточки студентов\n• Рейтинг 3.0–5.0\n• Навыки и проекты", {
    x: 6.85,
    y: 1.3,
    w: 2.5,
    h: 3.4,
    fontFace: FONT,
    fontSize: 16,
    color: TEXT,
    valign: "top",
  });
  slide.addText("Адаптивный дизайн — ПК, планшет, смартфон", {
    x: 0.6,
    y: 5.1,
    w: 8.8,
    h: 0.4,
    fontFace: FONT,
    fontSize: 18,
    italic: true,
    color: SUBTEXT,
    align: "center",
  });
}

// Slide 9 — Паттерны, технологии, методы
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Паттерны, технологии и методы программирования");
  addBullets(slide, [
    "MVC, SPA, модульная и компонентная архитектура интерфейса",
    "Динамический рендеринг DOM, обработка событий, модальные окна",
    "Алгоритмы buildGrades и генерации портфолио по типу успеваемости",
  ]);
}

// Slide 10 — Достигнутые результаты
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Достигнутые результаты");
  addBullets(slide, [
    "Реализовано веб-приложение с 30 демонстрационными профилями студентов",
    "Автоматическая генерация успеваемости за 4 курса обучения",
    "Поиск в реальном времени и персонализированные карточки портфолио",
  ]);
}

// Slide 11 — Преимущества, недостатки, перспективы
{
  const slide = pptx.addSlide();
  setBg(slide);
  addSlideTitle(slide, "Преимущества, недостатки и перспективы");
  const cols = [
    {
      x: 0.4,
      title: "Преимущества",
      color: "2D6A4F",
      items: ["Простое развёртывание", "Интуитивный интерфейс", "Централизация данных"],
    },
    {
      x: 3.45,
      title: "Недостатки",
      color: "6B3A3A",
      items: ["Нет серверной части", "Демо-данные в коде", "Нет аутентификации"],
    },
    {
      x: 6.5,
      title: "Перспективы",
      color: "1D4E89",
      items: ["Backend и СУБД", "Интеграция с журналом", "Загрузка достижений"],
    },
  ];
  cols.forEach((col) => {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: col.x,
      y: 1.1,
      w: 2.9,
      h: 4.2,
      fill: { color: col.color },
      line: { color: ACCENT, pt: 1 },
      rectRadius: 0.08,
    });
    slide.addText(col.title, {
      x: col.x + 0.1,
      y: 1.25,
      w: 2.7,
      h: 0.4,
      fontFace: FONT,
      fontSize: 18,
      bold: true,
      color: TEXT,
      align: "center",
    });
    const bullets = col.items.map((item) => ({
      text: item,
      options: { bullet: true, breakLine: true },
    }));
    slide.addText(bullets, {
      x: col.x + 0.15,
      y: 1.8,
      w: 2.6,
      h: 3.2,
      fontFace: FONT,
      fontSize: 16,
      color: TEXT,
      valign: "top",
    });
  });
}

// Slide 12 — Спасибо за внимание
{
  const slide = pptx.addSlide();
  setBg(slide);
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 2.2,
    w: "100%",
    h: 1.2,
    fill: { color: ACCENT },
    line: { color: ACCENT },
  });
  slide.addText("Спасибо за внимание!", {
    x: 0.5,
    y: 2.35,
    w: 9,
    h: 0.9,
    fontFace: FONT,
    fontSize: 36,
    bold: true,
    color: TEXT,
    align: "center",
    valign: "middle",
  });
  slide.addText("Готов ответить на ваши вопросы", {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.5,
    fontFace: FONT,
    fontSize: 22,
    color: SUBTEXT,
    align: "center",
  });
}

const outPath = path.join(__dirname, "Презентация_диплом_Гамзатов.pptx");
pptx
  .writeFile({ fileName: outPath })
  .then(() => console.log("Создано:", outPath))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
