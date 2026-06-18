const directionTitle = "Информационные системы и программирование";

const subjectsByCourse = {
  1: [
    "Элементы высшей математики", "Основы алгоритмизации", "Операционные системы",
    "История", "Физическая культура", "Иностранный язык",
    "Дискретная математика", "Информационные технологии", "Архитектура аппаратных средств",
    "Курсовая работа (Введение в специальность)"
  ],
  2: [
    "Теория вероятностей", "Проектирование баз данных", "Компьютерные сети",
    "Экономика отрасли", "Безопасность жизнедеятельности", "Иностранный язык (проф.)",
    "Программные решения", "Метрология", "Основы философии",
    "Курсовая работа (Базы данных)"
  ],
  3: [
    "Разработка программных модулей", "Защита баз данных", "Менеджмент",
    "Правовое обеспечение", "Внедрение систем", "Психология общения",
    "Учебная практика", "Производственная практика", "Инженерная графика",
    "Курсовая работа (ПМ.01)"
  ],
  4: [
    "Мобильные приложения", "Веб-программирование", "Системное программирование",
    "Тестирование модулей", "Математическое моделирование", "Технология разработки ПО",
    "Преддипломная практика", "Производственная практика (ПМ.03)", "Инструментальные средства",
    "Дипломная работа"
  ],
};

const examsByCourse = {
  1: ["Элементы высшей математики", "Основы алгоритмизации", "Операционные системы"],
  2: ["Теория вероятностей", "Проектирование баз данных", "Компьютерные сети"],
  3: ["Разработка программных модулей", "Защита баз данных", "Менеджмент"],
  4: ["Мобильные приложения", "Веб-программирование", "Системное программирование"],
};

const zachetByCourse = {
  1: ["История", "Физическая культура", "Иностранный язык", "Дискретная математика", "Информационные технологии", "Архитектура аппаратных средств"],
  2: ["Экономика отрасли", "Безопасность жизнедеятельности", "Иностранный язык (проф.)", "Программные решения", "Метрология", "Основы философии"],
  3: ["Правовое обеспечение", "Внедрение систем", "Психология общения", "Учебная практика", "Производственная практика", "Инженерная графика"],
  4: ["Тестирование модулей", "Математическое моделирование", "Технология разработки ПО", "Преддипломная практика", "Производственная практика (ПМ.03)", "Инструментальные средства"],
};

const kurByCourse = {
  1: ["Курсовая работа (Введение в специальность)"],
  2: ["Курсовая работа (Базы данных)"],
  3: ["Курсовая работа (ПМ.01)"],
  4: ["Дипломная работа"],
};

// Генерация случайного российского номера телефона
function generateRussianPhone() {
  const codes = ['901', '902', '903', '904', '905', '906', '908', '909', '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922', '923', '924', '925', '926', '927', '928', '929', '930', '931', '932', '933', '934', '936', '937', '938', '939', '950', '951', '952', '953', '958', '960', '961', '962', '963', '964', '965', '966', '967', '968', '969', '980', '981', '982', '983', '984', '985', '986', '987', '988', '989'];
  const code = codes[Math.floor(Math.random() * codes.length)];
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `+7 (${code}) ${String(number).slice(0, 3)}-${String(number).slice(3, 5)}-${String(number).slice(5, 7)}`;
}

const rawStudents = [
  { id: "s1", name: "Гамзатов Мухтар Ибадуллаевич", gender: "m", group: "1", type: "top", phone: generateRussianPhone() },
  { id: "s2", name: "Зарема Абдуллаева Руслановна", gender: "f", group: "1", type: "top", phone: generateRussianPhone() },
  { id: "s3", name: "Расул Алиев Гаджиевич", gender: "m", group: "1", type: "top", phone: generateRussianPhone() },
  { id: "s4", name: "Патимат Гаджиева Омаровна", gender: "f", group: "1", type: "top", phone: generateRussianPhone() },
  { id: "s5", name: "Ахмед Гаджиев Мурадович", gender: "m", group: "1", type: "top", phone: generateRussianPhone() },
  { id: "s6", name: "Айша Курбанова Шамильевна", gender: "f", group: "1", type: "good_plus", phone: generateRussianPhone() },
  { id: "s7", name: "Мурад Сулейманов Ибрагимович", gender: "m", group: "1", type: "good_plus", phone: generateRussianPhone() },
  { id: "s8", name: "Салихат Исаева Ахмедовна", gender: "f", group: "1", type: "good_plus", phone: generateRussianPhone() },
  { id: "s9", name: "Ислам Гасанов Заурович", gender: "m", group: "1", type: "good_plus", phone: generateRussianPhone() },
  { id: "s10", name: "Хадижат Ахмедова Тимуровна", gender: "f", group: "1", type: "weak", phone: generateRussianPhone() },
  { id: "s11", name: "Абдулла Алиев Камилович", gender: "m", group: "1", type: "weak", phone: generateRussianPhone() },
  { id: "s12", name: "Мадина Исаева Арсеновна", gender: "f", group: "1", type: "weak", phone: generateRussianPhone() },
  { id: "s13", name: "Мурад Абдуллаев Русланович", gender: "m", group: "1", type: "weak", phone: generateRussianPhone() },
  { id: "s14", name: "Патимат Магомедова Саидовна", gender: "f", group: "1", type: "weak", phone: generateRussianPhone() },
  { id: "s15", name: "Сулейман Гаджиев Омарович", gender: "m", group: "1", type: "weak", phone: generateRussianPhone() },
  { id: "s16", name: "Саид Омаров Хабибович", gender: "m", group: "2", type: "top", phone: generateRussianPhone() },
  { id: "s17", name: "Фатима Исаева Магомедовна", gender: "f", group: "2", type: "top", phone: generateRussianPhone() },
  { id: "s18", name: "Омар Магомедов Ахмедович", gender: "m", group: "2", type: "top", phone: generateRussianPhone() },
  { id: "s19", name: "Зарина Алиева Гасановна", gender: "f", group: "2", type: "top", phone: generateRussianPhone() },
  { id: "s20", name: "Руслан Гасанов Мурадович", gender: "m", group: "2", type: "top", phone: generateRussianPhone() },
  { id: "s21", name: "Мариам Алиева Расуловна", gender: "f", group: "2", type: "good_plus", phone: generateRussianPhone() },
  { id: "s22", name: "Тимур Магомедов Исламович", gender: "m", group: "2", type: "good_plus", phone: generateRussianPhone() },
  { id: "s23", name: "Лейла Гаджиева Шамильевна", gender: "f", group: "2", type: "good_plus", phone: generateRussianPhone() },
  { id: "s24", name: "Арсен Исаев Абдуллаевич", gender: "m", group: "2", type: "good_plus", phone: generateRussianPhone() },
  { id: "s25", name: "Амина Курбанова Зауровна", gender: "f", group: "2", type: "weak", phone: generateRussianPhone() },
  { id: "s26", name: "Шамиль Гасанов Ибрагимович", gender: "m", group: "2", type: "weak", phone: generateRussianPhone() },
  { id: "s27", name: "Хабиб Нурмагомедов Магомедович", gender: "m", group: "2", type: "weak", phone: generateRussianPhone() },
  { id: "s28", name: "Диана Магомедова Омаровна", gender: "f", group: "2", type: "weak", phone: generateRussianPhone() },
  { id: "s29", name: "Заур Алиев Саидович", gender: "m", group: "2", type: "weak", phone: generateRussianPhone() },
  { id: "s30", name: "Камила Гаджиева Арсеновна", gender: "f", group: "2", type: "weak", phone: generateRussianPhone() },
];

const portfolioData = {
  "s1": {
    skills: ["Python", "Java", "C++", "SQL", "Git", "Docker"],
    description: "Ответственный и целеустремлённый студент. Легко осваиваю новые технологии и люблю решать сложные задачи. Умею работать в команде и брать на себя ответственность. Увлекаюсь математикой и алгоритмами, постоянно развиваюсь в области backend-разработки. В свободное время пишу статьи о программировании для студентов.",
    strengths: ["Алгоритмы", "Архитектура систем", "Оптимизация кода"],
    achievements: ["1 место - Всероссийский Хакатон", "Стипендия Правительства РФ"],
    projects: ["Система управления портфолио", "Образовательная платформа"]
  },
  "s2": {
    skills: ["JavaScript", "React", "Node.js", "HTML", "CSS", "Git"],
    description: "Креативная и внимательная к деталям. Специализируюсь на фронтенд-разработке, создаю современные и удобные интерфейсы. Увлекаюсь дизайном и UI/UX, всегда стремлюсь к идеальному сочетанию красоты и функциональности. В свободное время рисую иллюстрации и разрабатываю личные проекты.",
    strengths: ["Фронтенд", "UI/UX", "Адаптивная верстка"],
    achievements: ["2 место - Конкурс веб-дизайна", "Лучший проект курса"],
    projects: ["Веб-приложение для колледжа", "Личный сайт-портфолио"]
  },
  "s3": {
    skills: ["C#", ".NET", "SQL Server", "ASP.NET", "Git", "Docker"],
    description: "Дисциплинированный и методичный. Успею всё и даже больше! Люблю работать с базами данных и создавать надёжные серверные решения. Увлекаюсь тестированием и DevOps, всегда следую лучшим практикам разработки. В свободное время играю в шахматы и читаю книги о программной инженерии.",
    strengths: ["Бэкенд", "Базы данных", "Тестирование"],
    achievements: ["3 место - Олимпиада по JavaScript"],
    projects: ["API для вуза", "Система мониторинга успеваемости"]
  },
  "s4": {
    skills: ["Python", "Django", "PostgreSQL", "JavaScript", "Git", "Linux"],
    description: "Люблю backend-разработку и всё, что с ней связано. Создаю масштабируемые и безопасные веб-приложения. Увлекаюсь кибербезопасностью и постоянно изучаю новые методы защиты данных. В свободное время занимаюсь волонтерством, помогая небольшим компаниям с техническими вопросами.",
    strengths: ["Django", "PostgreSQL", "Безопасность"],
    achievements: ["Сертификат Coursera", "Победитель университетского конкурса"],
    projects: ["Бэкенд для онлайн-курсов", "Платформа обмена знаниями"]
  },
  "s5": {
    skills: ["Java", "Spring", "Kotlin", "Android", "SQL", "Git"],
    description: "Мобильная разработка — моя страсть! Создаю удобные и быстрые приложения для Android. Также увлекаюсь Java Enterprise и микросервисной архитектурой. В свободное время изучаю новые технологии и пишу приложения для себя и друзей. Увлекаюсь фотографией и путешествиями.",
    strengths: ["Android", "Kotlin", "Spring"],
    achievements: ["1 место - Конкурс мобильных приложений", "Сертификат Google"],
    projects: ["Мобильное приложение для студентов", "Приложение для расписания"]
  },
  "s6": {
    skills: ["JavaScript", "Vue.js", "PHP", "MySQL", "Git", "Figma"],
    description: "Хорошо справляюсь как с фронтендом, так и с бэкендом. Умею находить общий язык с командой и выполнять задачи качественно. Увлекаюсь дизайном интерфейсов и прототипированием, всегда стремлюсь к идеальному пользовательскому опыту. В свободное время рисует и занимается фотографией.",
    strengths: ["Vue.js", "PHP", "Дизайн интерфейсов"],
    achievements: ["Участие в хакатоне", "Лучший доклад на конференции"],
    projects: ["Онлайн-магазин", "Платформа для тестирования"]
  },
  "s7": {
    skills: ["C++", "Qt", "OpenGL", "Python", "Git", "Linux"],
    description: "Увлекаюсь компьютерной графикой и десктопными приложениями. Всегда довожу дела до конца и помогаю товарищам. Увлекаюсь 3D-моделированием и визуализацией данных, создаю интересные проекты в свободное время. Любит играть в видеоигры и изучать историю.",
    strengths: ["C++", "Qt", "Графика"],
    achievements: ["Победа в конкурсе 3D-визуализации"],
    projects: ["Программа для 3D-моделирования", "Игра на OpenGL"]
  },
  "s8": {
    skills: ["TypeScript", "Angular", "NestJS", "PostgreSQL", "Git", "Docker"],
    description: "Серьёзный подход к учёбе и работе. Умею разбираться в сложных архитектурах и писать чистый код. Увлекается TypeScript и современными фреймворками, всегда старается следовать трендам. В свободное время читает технические книги и ходит в спортзал.",
    strengths: ["Angular", "NestJS", "TypeScript"],
    achievements: ["Сертификат Stepik", "Призёр олимпиады"],
    projects: ["CRM-система", "Корпоративный портал"]
  },
  "s9": {
    skills: ["Go", "gRPC", "Redis", "PostgreSQL", "Git", "Linux"],
    description: "Люблю высоконагруженные системы и микросервисы. Успеваемость всегда на высоком уровне! Увлекается системным администрированием и DevOps, старается автоматизировать всё, что можно. В свободное время играет в футбол и изучает новые языки программирования.",
    strengths: ["Go", "Микросервисы", "Redis"],
    achievements: ["Стажировка в IT-компании"],
    projects: ["Микросервисная архитектура", "Прокси-сервер"]
  },
  "s10": {
    skills: ["HTML", "CSS", "JavaScript", "WordPress", "Git"],
    description: "Стараюсь и постепенно осваиваю веб-разработку. Хорошо делаю сайты на WordPress и простые лендинги. Увлекается дизайном и созданием красивых интерфейсов, всегда старается учиться чему-то новому. В свободное время пишет в блог и занимается рукоделием.",
    strengths: ["Верстка", "WordPress", "Дизайн лендингов"],
    achievements: ["Участие в проектной работе"],
    projects: ["Лендинг для мероприятия", "Сайт для малого бизнеса"]
  },
  "s11": {
    skills: ["Python", "Pandas", "NumPy", "Excel", "Git"],
    description: "Интересуюсь анализом данных. Стараюсь активно участвовать в парах и улучшать свои навыки. Увлекается статистикой и визуализацией данных, любит находить интересные инсайты в информации. В свободное время играет в волейбол и читает книги о Data Science.",
    strengths: ["Анализ данных", "Excel", "Визуализация"],
    achievements: ["Проект по статистике"],
    projects: ["Система анализа оценок", "Отчёты для деканата"]
  },
  "s12": {
    skills: ["C#", "Unity", "Git", "Blender"],
    description: "Разработка игр — моё хобби! Учусь создавать простые игры и 3D-модели. Увлекается игровой индустрией и геймдизайном, мечтает создавать собственные большие проекты. В свободное время играет в видеоигры и рисует концепт-арты.",
    strengths: ["Unity", "C# для игр", "3D-моделирование"],
    achievements: ["Участие в Game Jam"],
    projects: ["2D-платформер", "Простая 3D-игра"]
  },
  "s13": {
    skills: ["Java", "SQL", "Git", "HTML", "CSS"],
    description: "Усердный студент, стараюсь во всём разобраться. Нравится работать с базами данных и простыми приложениями. Увлекается классическим программированием и изучением алгоритмов, всегда готов помочь товарищам. В свободное время играет в шахматы и читает книги о математике.",
    strengths: ["Java", "SQL", "Документация"],
    achievements: ["Похвальная грамота за успеваемость"],
    projects: ["Приложение для заметок", "База данных библиотеки"]
  },
  "s14": {
    skills: ["JavaScript", "Node.js", "Express", "MongoDB", "Git"],
    description: "Пытаюсь освоить полный стек веб-разработки. Люблю учиться новому и применять на практике. Увлекается современными технологиями и созданием сервисов для людей, всегда стремится к саморазвитию. В свободное время ходит в спортзал и слушает музыку.",
    strengths: ["Node.js", "Express", "MongoDB"],
    achievements: ["Проект по веб-разработке"],
    projects: ["Чат для студентов", "Сервис коротких ссылок"]
  },
  "s15": {
    skills: ["PHP", "Laravel", "MySQL", "HTML", "CSS", "Git"],
    description: "Люблю PHP и Laravel! Стараюсь создавать удобные и функциональные веб-приложения. Увлекается backend-разработкой и оптимизацией баз данных, всегда стремится к чистому и понятному коду. В свободное время играет в компьютерные игры и помогает товарищам с учебой.",
    strengths: ["Laravel", "PHP", "MySQL"],
    achievements: ["Проект для практики"],
    projects: ["Блог на Laravel", "Система заявок"]
  },
  "s16": {
    skills: ["Swift", "iOS", "Xcode", "Git", "Firebase"],
    description: "iOS-разработка — моя мечта! Учусь создавать приложения для iPhone и iPad. Увлекается мобильными технологиями и дизайном iOS, мечтает работать в крупной компании. В свободное время фотографирует и путешествует по городам.",
    strengths: ["Swift", "iOS", "Firebase"],
    achievements: ["1 место - Конкурс iOS-приложений"],
    projects: ["Приложение для фитнеса", "Планировщик задач"]
  },
  "s17": {
    skills: ["Rust", "Go", "C", "Linux", "Git", "Bash"],
    description: "Низкоуровневое программирование и системное администрирование — это круто! Успеваемость отличная. Увлекается системным программированием и безопасностью, любит разбираться в устройстве компьютера. В свободное время играет на гитаре и ходит в походы.",
    strengths: ["Rust", "Системное программирование", "Linux"],
    achievements: ["Сертификат по Linux"],
    projects: ["Утилита для файлов", "Собственная оболочка"]
  },
  "s18": {
    skills: ["TypeScript", "React", "Redux", "Node.js", "PostgreSQL", "Git"],
    description: "Ответственно подхожу к любому заданию. Создаю современные реакт-приложения с красивым интерфейсом. Увлекается фронтенд-разработкой и архитектурой приложений, всегда следит за новинками в мире React. В свободное время играет в баскетбол и читает комиксы.",
    strengths: ["React", "TypeScript", "Redux"],
    achievements: ["2 место - Хакатон ДГУ"],
    projects: ["Дашборд для студентов", "Приложение для заметок"]
  },
  "s19": {
    skills: ["Kotlin", "Android", "Jetpack", "Firebase", "SQL", "Git"],
    description: "Каждый день улучшаю свои навыки мобильной разработки. Умею создавать стабильные приложения. Увлекается дизайном мобильных интерфейсов и Material Design, стремится к идеальному пользовательскому опыту. В свободное время рисует и занимается йогой.",
    strengths: ["Kotlin", "Android Jetpack", "Firebase"],
    achievements: ["Сертификат Android Developer"],
    projects: ["Приложение для погоды", "Прогресс-трекер"]
  },
  "s20": {
    skills: ["Python", "Machine Learning", "TensorFlow", "Scikit-learn", "Git", "Linux"],
    description: "Очень люблю машинное обучение и анализ данных! Готовлюсь к карьере в Data Science. Увлекается математикой и статистикой, любит находить закономерности в данных. В свободное время играет в теннис и участвует в хакатонах по Data Science.",
    strengths: ["ML", "TensorFlow", "Анализ данных"],
    achievements: ["Публикация в студенческом журнале"],
    projects: ["Классификатор изображений", "Прогнозирование оценок"]
  },
  "s21": {
    skills: ["JavaScript", "Svelte", "Node.js", "SQLite", "Git", "Figma"],
    description: "С Svelte работаю быстро и получаю удовольствие! Создаю простые, но красивые приложения. Увлекается прототипированием и дизайном интерфейсов, любит быстро превращать идеи в реальность. В свободное время занимается фотографией и путешествиями.",
    strengths: ["Svelte", "Прототипирование", "Figma"],
    achievements: ["Лучший прототип на хакатоне"],
    projects: ["Трекер привычек", "Приложение для бюджета"]
  },
  "s22": {
    skills: ["C++", "Unreal Engine", "Blueprints", "Git", "Blender"],
    description: "Unreal Engine — моя любовь! Учусь делать крутые 3D-игры и визуализации. Увлекается игровой индустрией и 3D-моделированием, мечтает работать в крупной игровой студии. В свободное время играет в видеоигры и создаёт 3D-арт.",
    strengths: ["Unreal Engine", "C++", "Blueprints"],
    achievements: ["Участие в Unreal Jam"],
    projects: ["3D-шутер", "Визуализация архитектуры"]
  },
  "s23": {
    skills: ["Ruby", "Rails", "PostgreSQL", "HTML", "CSS", "Git"],
    description: "Ruby on Rails позволяет создавать приложения очень быстро! Успеваемость хорошая. Увлекается веб-разработкой и agile-методологиями, любит работать в команде. В свободное время ходит в театр и читает классическую литературу.",
    strengths: ["Rails", "Ruby", "Agile"],
    achievements: ["Проект на Rails"],
    projects: ["Доска объявлений", "Социальная сеть для группы"]
  },
  "s24": {
    skills: ["Elixir", "Phoenix", "PostgreSQL", "Git", "Linux"],
    description: "Функциональное программирование — это мощно! Учусь Elixir и Phoenix. Увлекается распределёнными системами и отказоустойчивыми приложениями, любит изучать парадигмы программирования. В свободное время играет в шахматы и занимается йогой.",
    strengths: ["Elixir", "Phoenix", "Функциональное ПО"],
    achievements: ["Изучил Elixir за месяц"],
    projects: ["Чат на Phoenix", "Сервер для игр"]
  },
  "s25": {
    skills: ["HTML", "CSS", "Tailwind CSS", "JavaScript", "Git"],
    description: "Верстка получается хорошо! Стараюсь сделать всё аккуратно и по стандартам. Увлекается дизайном и созданием красивых интерфейсов, следит за трендами в веб-разработке. В свободное время рисует и делает фотографию.",
    strengths: ["Tailwind", "Верстка", "Кроссбраузерность"],
    achievements: ["Лучшая верстка на курсе"],
    projects: ["Верстка лендинга", "Верстка интернет-магазина"]
  },
  "s26": {
    skills: ["Java", "Swing", "MySQL", "Git", "NetBeans"],
    description: "Классический Java и базы данных — это фундамент! Уверенно работаю с ними. Увлекается ООП и архитектурой приложений, всегда готов помочь товарищам с учебой. В свободное время играет в футбол и читает технические книги.",
    strengths: ["Java Swing", "MySQL", "ООП"],
    achievements: ["Успеваемость 4+", "Помощь товарищам"],
    projects: ["Приложение для учёта товаров", "Калькулятор на Java"]
  },
  "s27": {
    skills: ["C", "Assembly", "Arduino", "Git", "Linux"],
    description: "Железо и низкоуровневое программирование — это то, что мне нравится! Увлекается электроникой и микроконтроллерами, любит создавать устройства своими руками. В свободное время играет на барабанах и ходит в походы с друзьями.",
    strengths: ["C", "Arduino", "Электроника"],
    achievements: ["Проект с Arduino"],
    projects: ["Автоматизация помещения", "Метеостанция"]
  },
  "s28": {
    skills: ["PHP", "Yii2", "MySQL", "JavaScript", "Git", "Bootstrap"],
    description: "Yii2 — мощный фреймворк! Использую его для создания сервисов для студентов. Увлекается веб-разработкой и созданием полезных сервисов, всегда старается сделать интерфейс максимально удобным. В свободное время читает книги и занимается фитнесом.",
    strengths: ["Yii2", "PHP", "Bootstrap"],
    achievements: ["Проект для практики"],
    projects: ["Система записи на консультации", "Опросник"]
  },
  "s29": {
    skills: ["Perl", "Python", "Bash", "Git", "Linux", "Regular Expressions"],
    description: "Скрипты и автоматизация — моя стихия! Умею упростить рутинные задачи. Увлекается системным администрированием и созданием утилит, любит находить способы автоматизировать всё. В свободное время играет в шахматы и изучает историю.",
    strengths: ["Скрипты", "Автоматизация", "RegExp"],
    achievements: ["Автоматизировал отчёты"],
    projects: ["Скрипт для обработки оценок", "Автобэкап"]
  },
  "s30": {
    skills: ["Dart", "Flutter", "Firebase", "Git", "Figma"],
    description: "Flutter позволяет писать приложения для Android и iOS сразу! Это круто! Увлекается кроссплатформенной разработкой и дизайном мобильных приложений, всегда стремится к идеальному пользовательскому опыту. В свободное время рисует и занимается йогой.",
    strengths: ["Flutter", "Dart", "Firebase"],
    achievements: ["Простое кроссплатформенное приложение"],
    projects: ["Калькулятор на Flutter", "Список покупок"]
  }
};

const students = rawStudents.map((s, idx) => ({
  ...s,
  courseNow: 4,
  year: 2026,
  direction: directionTitle,
  studyForm: idx % 3 === 0 ? "Заочная" : "Очная",
  studyBase: idx % 5 === 0 ? "Платная" : "Бюджетная",
  gradesByCourse: { 
    1: buildGrades(0, 1, s.type), 
    2: buildGrades(0, 2, s.type), 
    3: buildGrades(0, 3, s.type), 
    4: buildGrades(0, 4, s.type) 
  },
  portfolio: portfolioData[s.id] || {
    skills: ["HTML", "CSS", "JavaScript", "Git"],
    description: "Студент колледжа ДГУ, направление Информационные системы и программирование.",
    strengths: ["Учёба", "Ответственность"],
    achievements: ["Успеваемость"],
    projects: ["Курсовые проекты"]
  }
}));

const skillCategories = [
  {
    id: 'languages',
    title: 'Языки программирования',
    isGroup: true,
    subcategories: [
      { id: 'python', title: 'Python', skills: ['Python'] },
      { id: 'java', title: 'Java', skills: ['Java'] },
      { id: 'csharp', title: 'C#', skills: ['C#'] },
      { id: 'cpp', title: 'C++', skills: ['C++'] },
      { id: 'javascript', title: 'JavaScript', skills: ['JavaScript'] },
      { id: 'php', title: 'PHP', skills: ['PHP'] }
    ]
  },
  {
    id: 'mobile',
    title: 'Мобильная разработка',
    isGroup: true,
    subcategories: [
      { id: 'android', title: 'Android', skills: ['Android', 'Kotlin'] },
      { id: 'ios', title: 'iOS', skills: ['iOS', 'Swift'] },
      { id: 'flutter', title: 'Flutter', skills: ['Flutter'] }
    ]
  },
  {
    id: 'web',
    title: 'Веб-разработка',
    isGroup: true,
    subcategories: [
      { id: 'frontend', title: 'Фронтенд', skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue'] },
      { id: 'backend', title: 'Бэкенд', skills: ['Node.js', 'PHP', 'Express', 'PostgreSQL', 'Django', 'Laravel'] }
    ]
  },
  {
    id: 'design',
    title: 'Графический дизайн',
    isGroup: true,
    subcategories: [
      { id: 'uiux', title: 'UI/UX', skills: ['Figma', 'UI/UX'] },
      { id: 'graphic', title: 'Графика', skills: ['Photoshop', 'Adobe'] },
      { id: 'video', title: 'Видео', skills: ['Premiere Pro', 'After Effects'] }
    ]
  }
];

function getStudentsBySkills(skillsList, limit = 6) {
  return students
    .filter(s => s.portfolio.skills.some(skill => 
      skillsList.some(targetSkill => 
        skill.toLowerCase().includes(targetSkill.toLowerCase())
      )
    ))
    .sort((a, b) => {
      const aCount = a.portfolio.skills.filter(skill => 
        skillsList.some(targetSkill => 
          skill.toLowerCase().includes(targetSkill.toLowerCase())
        )
      ).length;
      const bCount = b.portfolio.skills.filter(skill => 
        skillsList.some(targetSkill => 
          skill.toLowerCase().includes(targetSkill.toLowerCase())
        )
      ).length;
      return bCount - aCount;
    })
    .slice(0, limit);
}

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) =>
  (s ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function getGradeClass(grade) {
  if (!grade) return "";
  const g = grade.toString().toLowerCase();
  if (g.includes("отл") || g.includes("5")) return "excellent";
  if (g.includes("хор") || g.includes("4")) return "good";
  if (g.includes("удовл") || g.includes("3")) return "satisfactory";
  if (g.includes("неуд") || g.includes("2")) return "fail";
  if (g.includes("зачет")) return "excellent";
  return "";
}

function buildGrades(seed, course, type) {
  const subjects = subjectsByCourse[course] || [];
  const res = {};
  const exams = examsByCourse[course] || [];
  const kurs = kurByCourse[course] || [];
  const zachets = zachetByCourse[course] || [];
  
  const toText = (g) => {
    if (g === 5) return "отл";
    if (g === 4) return "хор";
    if (g === 3) return "удовл";
    return "неуд";
  };

  subjects.forEach((sub, idx) => {
    let grade = 5;
    let retake = "";

    if (type === 'top') {
      grade = 5;
    } else if (type === 'good_plus') {
      grade = (idx % 4 === 0) ? 4 : 5;
    } else {
      const r = (seed + idx) % 10;
      if (r < 2) grade = 5;
      else if (r < 5) grade = 4;
      else grade = 3;
      
      if (r > 7) retake = " (п)";
    }

    const isExam = exams.includes(sub);
    const isKur = kurs.includes(sub);
    const isZachet = zachets.includes(sub);
    const isZachetWithGrade = isZachet && zachets.indexOf(sub) < 3;

    res[sub] = {
      att1: "атт",
      att2: "атт",
      dfk: "",
      kur: isKur ? toText(grade) : "",
      zach: isZachet ? (isZachetWithGrade ? toText(grade) : (grade > 2 ? "зачет" : "незачет")) : "",
      ekz: isExam ? (toText(grade) + retake) : ""
    };
  });
  return res;
}

function getIcon(gender) {
  const path = gender === 'm' 
    ? "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    : "M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zm0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z";
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg viewBox="0 0 24 24" fill="%2364748b" xmlns="http://www.w3.org/2000/svg"><path d="${path}"/></svg>`)}`;
}

function renderRow(s, idx) {
  return `
    <div class="student-row" data-open="${s.id}">
      <div class="student-row__index">${idx + 1}</div>
      <div class="student-row__name">
        ${esc(s.name)}
        <div style="font-size: 11px; color: #94a3b8; font-weight: 400;">
          Группа ${esc(s.group)} • ${s.studyForm} • ${s.studyBase}
        </div>
      </div>
      <div class="student-row__faculty">${esc(s.direction)}</div>
      <div class="student-row__course">4 курс</div>
      <div class="student-row__action"></div>
    </div>
  `;
}

function renderFullscreen(s, courseId) {
  const course = Number(courseId || 4);
  const grades = s.gradesByCourse?.[course] || {};
  
  const rows = (subjectsByCourse[course] || []).map((sub) => {
    const g = grades[sub] || {};
    return `
      <tr>
        <td style="font-weight: 600;">${esc(sub)}</td>
        <td class="tc" style="color: #94a3b8;">${esc(g.att1)}</td>
        <td class="tc" style="color: #94a3b8;">${esc(g.att2)}</td>
        <td class="tc"><span class="grade-val">${esc(g.kur)}</span></td>
        <td class="tc"><span class="grade-val">${esc(g.zach)}</span></td>
        <td class="tc"><span class="grade-val">${esc(g.ekz)}</span></td>
      </tr>
    `;
  }).join("");

  return `
    <div class="modal-content">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 12px;">
        </div>
        <button class="btn-close" id="btn-close">Закрыть</button>
      </div>

      <div class="modal-profile">
        <div class="profile-avatar-big">
          <img src="${getIcon(s.gender)}" alt="">
        </div>
        <div class="profile-details">
          <h2 style="margin: 0 0 4px; font-size: 24px;">${esc(s.name)}</h2>
          <div style="color: #94a3b8; font-size: 14px;">
            Группа ${esc(s.group)} • ${esc(s.direction)}
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="grades-header">
          <h3 style="font-size: 18px; font-weight: 700;">Академическая успеваемость</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="flabel">Курс:</span>
            <select class="select" id="m-course">
              <option value="1" ${course === 1 ? "selected" : ""}>1 курс</option>
              <option value="2" ${course === 2 ? "selected" : ""}>2 курс</option>
              <option value="3" ${course === 3 ? "selected" : ""}>3 курс</option>
              <option value="4" ${course === 4 ? "selected" : ""}>4 курс</option>
            </select>
          </div>
        </div>

        <div class="grades-table-wrapper">
          <table class="grades-table">
            <thead>
              <tr>
                <th>Дисциплина</th>
                <th class="tc" style="width: 70px;">Атт. 1</th>
                <th class="tc" style="width: 70px;">Атт. 2</th>
                <th class="tc" style="width: 80px;">${course === 4 ? 'Дип.' : 'Курс.'}</th>
                <th class="tc" style="width: 100px;">Зачет</th>
                <th class="tc" style="width: 100px;">Экзамен</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function openFullscreen(id, course) {
  const s = students.find(x => x.id == id);
  if (!s) return;
  const view = $("#fullscreen-view");
  view.innerHTML = renderFullscreen(s, course);
  view.style.display = "flex";
  setTimeout(() => view.classList.add("active"), 10);
  document.body.style.overflow = "hidden";

  $("#btn-close").onclick = () => {
    view.classList.remove("active");
    setTimeout(() => view.style.display = "none", 200);
    document.body.style.overflow = "";
  };

  $("#m-course").onchange = (e) => {
    openFullscreen(id, e.target.value);
  };

  view.onclick = (e) => {
    if (e.target === view) {
      view.classList.remove("active");
      setTimeout(() => view.style.display = "none", 200);
      document.body.style.overflow = "";
    }
  };
}

function renderHome() {
  return `
    <div class="home-full">
      <div class="home-hero">
        <h1 style="font-size: 72px; letter-spacing: 0.05em; margin-bottom: 32px; font-weight: 900; text-transform: uppercase;">Электронное портфолио</h1>
        <p style="font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 48px;">Студенты Колледжа ДГУ • Информационные системы и программирование</p>
        
        <div style="display: flex; gap: 20px; justify-content: center;">
          <button class="btn-search" style="padding: 16px 40px; font-size: 16px; background: var(--accent); color: white; border: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;" onclick="document.getElementById('nav-portfolio').click()">Портфолио</button>
          <button class="btn-reset" style="padding: 16px 40px; font-size: 16px; border: 2px solid rgba(255, 255, 255, 0.4); color: white; background: transparent; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;" onclick="document.getElementById('nav-grades').click()">Успеваемость</button>
        </div>
        
        <div style="margin-top: 80px; animation: bounce 2s infinite;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      </div>
      
      <div class="home-categories">
        <div class="home-categories-inner">
          <h2 style="text-align: left; font-size: 28px; font-weight: 800; margin-bottom: 32px; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em;">Компетенции</h2>
          
          ${skillCategories.map(cat => {
            if (cat.isGroup) {
              return `
                <div style="margin-bottom: 40px;">
                  <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">${cat.title}</h3>
                  <div style="border-left: 3px solid var(--accent); padding-left: 16px; margin-left: 8px;">
                    ${cat.subcategories.map(subcat => {
                      const categoryStudents = getStudentsBySkills(subcat.skills);
                      return `
                        <div class="category-card" data-category="${subcat.id}" style="margin-bottom: 8px;">
                          <button class="category-toggle" onclick="toggleCategory('${subcat.id}')">
                            <span style="font-size: 14px; font-weight: 700;">${subcat.title}</span>
                            <svg style="margin-left: auto; transition: transform 0.3s ease;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-arrow"><path d="M6 9l6 6 6-6"/></svg>
                          </button>
                          <div class="category-content" id="category-content-${subcat.id}" style="max-height: 0; overflow: hidden; transition: max-height 0.4s ease;">
                            <div class="category-students">
                              ${categoryStudents.length > 0 ? categoryStudents.map(s => `
                                <div class="category-student" onclick="goToStudentPortfolio('${s.id}')">
                                  <div class="category-student-avatar" style="background: var(--accent); color: white; width: 48px; height: 48px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px;">
                                    ${s.name.split(' ')[0][0]}${s.name.split(' ')[1] ? s.name.split(' ')[1][0] : ''}
                                  </div>
                                  <div class="category-student-info">
                                    <h4 style="margin: 0; font-size: 14px; font-weight: 700;">${esc(s.name)}</h4>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                                      ${s.portfolio.strengths.slice(0,3).map(str => `<span style="font-size: 10px; padding: 2px 6px; background: #f1f5f9; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">${esc(str)}</span>`).join('')}
                                    </div>
                                  </div>
                                </div>
                              `).join('') : '<p style="color: var(--text-muted); padding: 20px; font-size:13px;">Пока нет студентов</p>'}
                            </div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            } else {
              return '';
            }
          }).join('')}
        </div>
      </div>
    </div>
    ${renderFooter(true)}
  `;
}

function toggleCategory(categoryId) {
  const content = document.getElementById(`category-content-${categoryId}`);
  const card = document.querySelector(`.category-card[data-category="${categoryId}"]`);
  const arrow = card.querySelector('.category-arrow');
  
  if (content.style.maxHeight === '0px' || !content.style.maxHeight) {
    content.style.maxHeight = content.scrollHeight + 'px';
    arrow.style.transform = 'rotate(180deg)';
    card.classList.add('category-open');
  } else {
    content.style.maxHeight = '0px';
    arrow.style.transform = 'rotate(0deg)';
    card.classList.remove('category-open');
  }
}

function goToStudentPortfolio(studentId) {
  navigate('portfolio');
  setTimeout(() => {
    openPortfolioDetail(studentId);
  }, 100);
}

function renderPerformanceView() {
  return `
    <div class="search-form">
      <div class="search-row">
        <label>Филиал</label>
        <select class="search-select" id="f-branch">
          <option value="mkh">г. Махачкала</option>
        </select>
      </div>
      <div class="search-row">
        <label>Факультет</label>
        <select class="search-select" id="f-faculty">
          <option value="college">Колледж ДГУ</option>
        </select>
      </div>
      <div class="search-row">
        <label>Направление</label>
        <select class="search-select" id="f-direction">
          <option value="isp">${directionTitle}</option>
        </select>
      </div>
      <div class="search-row">
        <label>Фамилия</label>
        <input class="search-input" type="text" id="s-lastname" placeholder="Укажите фамилию">
      </div>
      <div class="search-row">
        <label>Имя</label>
        <input class="search-input" type="text" id="s-firstname" placeholder="Укажите имя">
      </div>
      <div class="search-row">
        <label>Отчество</label>
        <input class="search-input" type="text" id="s-patronymic" placeholder="Укажите отчество">
      </div>
      
      <div class="search-actions">
        <button class="btn-search" id="btn-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Поиск
        </button>
        <button class="btn-reset" id="btn-reset">Сбросить</button>
      </div>
    </div>

    <div class="student-list-container">
      <div class="list-header">
        <div>№</div>
        <div>Студент</div>
        <div>Направление</div>
        <div>Курс</div>
        <div></div>
      </div>
      <div id="tbody"></div>
    </div>
    ${renderFooter()}
  `;
}

function renderPortfolioView() {
  return `
    <div class="search-form">
      <div class="search-row">
        <label>Поиск</label>
        <input class="search-input" type="text" id="portfolio-search" placeholder="Поиск по имени">
      </div>
      
      <div class="search-actions">
        <button class="btn-search" id="portfolio-btn-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          Найти
        </button>
      </div>
    </div>

    <div class="portfolio-grid" id="portfolio-grid">
    </div>
    ${renderFooter()}
  `;
}

function renderPortfolioCard(s, idx) {
  const skillsText = s.portfolio.skills.slice(0, 3).join(', ') + (s.portfolio.skills.length > 3 ? '...' : '');
  return `
    <div class="portfolio-card" data-portfolio-id="${s.id}" style="animation: fadeIn 0.3s ease ${idx * 0.05}s both;">
      <div class="portfolio-card__header">
        <h3 class="portfolio-name">${esc(s.name)}</h3>
        <p class="portfolio-phone" style="font-size:12px;color:var(--text-muted);margin:4px 0 8px 0;">${esc(s.phone)}</p>
        <p class="portfolio-skills">${esc(skillsText)}</p>
      </div>
    </div>
  `;
}

function renderPortfolioDetail(s) {
  const skills = s.portfolio.skills;
  const strengths = s.portfolio.strengths;
  const achievements = s.portfolio.achievements;
  const projects = s.portfolio.projects;
  
  return `
    <div class="modal-content">
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 12px;">
          <h2 style="margin: 0;">${esc(s.name)}</h2>
        </div>
        <button class="btn-close" id="btn-close-portfolio">Закрыть</button>
      </div>
      
      <div class="modal-body">
        <div class="portfolio-detail-section">
          <h3 class="portfolio-detail-title">Контакт</h3>
          <p class="portfolio-detail-text">${esc(s.phone)}</p>
        </div>
        <div class="portfolio-detail-section">
          <h3 class="portfolio-detail-title">О себе</h3>
          <p class="portfolio-detail-text">${esc(s.portfolio.description)}</p>
        </div>
        
        <div class="portfolio-detail-section">
          <h3 class="portfolio-detail-title">Навыки</h3>
          <div class="portfolio-tags">
            ${skills.map(skill => `<span class="portfolio-tag">${esc(skill)}</span>`).join('')}
          </div>
        </div>
        
        <div class="portfolio-detail-section">
          <h3 class="portfolio-detail-title">Сильные стороны</h3>
          <div class="portfolio-tags">
            ${strengths.map(strength => `<span class="portfolio-tag portfolio-tag--green">${esc(strength)}</span>`).join('')}
          </div>
        </div>
        
        <div class="portfolio-detail-section">
          <h3 class="portfolio-detail-title">Достижения</h3>
          <ul class="portfolio-list">
            ${achievements.map(achievement => `<li>${esc(achievement)}</li>`).join('')}
          </ul>
        </div>
        
        <div class="portfolio-detail-section">
          <h3 class="portfolio-detail-title">Проекты</h3>
          <div class="portfolio-tags">
            ${projects.map(project => `<span class="portfolio-tag portfolio-tag--purple">${esc(project)}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

let currentPortfolioStudentId = null;
function openPortfolioDetail(id) {
  const s = students.find(x => x.id == id);
  if (!s) return;
  currentPortfolioStudentId = id;
  const view = $("#fullscreen-view");
  view.innerHTML = renderPortfolioDetail(s);
  view.style.display = "flex";
  setTimeout(() => view.classList.add("active"), 10);
  document.body.style.overflow = "hidden";

  $("#btn-close-portfolio").onclick = () => {
    view.classList.remove("active");
    setTimeout(() => view.style.display = "none", 200);
    document.body.style.overflow = "";
  };

  view.onclick = (e) => {
    if (e.target === view) {
      view.classList.remove("active");
      setTimeout(() => view.style.display = "none", 200);
      document.body.style.overflow = "";
    }
  };
}

function initPerformanceLogic() {
  const update = () => {
    const ln = $("#s-lastname").value.toLowerCase();
    const fn = $("#s-firstname").value.toLowerCase();
    const mn = $("#s-patronymic").value.toLowerCase();
    
    const list = students.filter(s => {
      const parts = s.name.toLowerCase().split(" ");
      const s_ln = parts[0] || "";
      const s_fn = parts[1] || "";
      const s_mn = parts[2] || "";
      
      const lnMatch = !ln || s_ln.includes(ln);
      const fnMatch = !fn || s_fn.includes(fn);
      const mnMatch = !mn || s_mn.includes(mn);
      
      return lnMatch && fnMatch && mnMatch;
    }).sort((a, b) => a.name.localeCompare(b.name));

    $("#tbody").innerHTML = list.map((s, idx) => renderRow(s, idx)).join("");
  };

  $("#btn-search").onclick = update;
  
  $("#btn-reset").onclick = () => {
    $("#s-lastname").value = "";
    $("#s-firstname").value = "";
    $("#s-patronymic").value = "";
    update();
  };

  [$("#s-lastname"), $("#s-firstname"), $("#s-patronymic")].forEach(el => {
    el.onkeydown = (e) => {
      if (e.key === "Enter") update();
    };
  });

  $("#tbody").onclick = (e) => {
    const row = e.target.closest("[data-open]");
    if (row) openFullscreen(row.dataset.open);
  };

  update();
}

function initPortfolioLogic() {
  const update = () => {
    const searchTerm = $("#portfolio-search")?.value?.toLowerCase() || "";
    
    const list = students.filter(s => {
      return !searchTerm || s.name.toLowerCase().includes(searchTerm);
    });

    const grid = $("#portfolio-grid");
    if (grid) {
      grid.innerHTML = list.map((s, idx) => renderPortfolioCard(s, idx)).join("");
      
      grid.querySelectorAll("[data-portfolio-id]").forEach(card => {
        card.onclick = () => openPortfolioDetail(card.dataset.portfolioId);
      });
    }
  };

  const searchBtn = $("#portfolio-btn-search");
  const searchInput = $("#portfolio-search");
  
  if (searchBtn) searchBtn.onclick = update;
  if (searchInput) {
    searchInput.onkeydown = (e) => {
      if (e.key === "Enter") update();
    };
  }

  update();
}

function renderAboutView() {
  return `
    <div style="max-width: 900px; margin: 0 auto;">
      <div class="search-form" style="margin-bottom: 24px;">
        <h3 style="margin-bottom: 16px; font-size: 24px; font-weight: 700;">Колледж ДГУ</h3>
        <p style="margin-bottom: 12px; line-height: 1.6;">Колледж Дагестанского государственного университета — современное учебное заведение, готовящее высококвалифицированных специалистов в области информационных технологий, программирования и других направлений.</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 24px;">
        <div class="search-form">
          <h4 style="margin-bottom: 12px; font-weight: 700;">Направления подготовки</h4>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li>Информационные системы и программирование</li>
            <li>Информационная безопасность</li>
            <li>Прикладная информатика</li>
            <li>Компьютерные сети</li>
          </ul>
        </div>
      </div>

      <div class="search-form">
        <h4 style="margin-bottom: 12px; font-weight: 700;">Наши достижения</h4>
        <p style="line-height: 1.6;">
          Колледж имеет высокие показатели трудоустройства выпускников, активно сотрудничает с ведущими IT-компаниями региона, 
          а также регулярно организует хакатоны, конференции и другие мероприятия для студентов.
        </p>
      </div>
    </div>

    ${renderFooter()}
  `;
}

function renderFooter(isHome = false) {
  const copyright = `Гамзатов Мухтар @ ${new Date().getFullYear()}`;
  return `
    <footer class="main-footer">
      <div class="footer-inner">
        <div class="footer-copyright">${copyright}</div>
        <div class="footer-links">
          <a href="#" onclick="navigate('about'); return false;" style="color: inherit; text-decoration: none;">О колледже</a>
          <a href="#" style="color: inherit; text-decoration: none;">Политика конфиденциальности</a>
          <a href="#" style="color: inherit; text-decoration: none;">Поддержка</a>
        </div>
      </div>
    </footer>
  `;
}

function navigate(page) {
  const dashboard = $(".dashboard");
  if (!dashboard) return;

  document.querySelectorAll(".nav-link").forEach(l => {
    l.classList.toggle("active", l.id === `nav-${page}`);
  });

  const app = $("#app");

  if (page === 'home') {
    dashboard.classList.add("is-home");
    $(".page-title").innerText = "Главная";
    $(".breadcrumb").innerHTML = `<span onclick="navigate('home')">Главная</span> / Приветствие`;
    app.innerHTML = renderHome();
  } else if (page === 'grades') {
    dashboard.classList.remove("is-home");
    $(".page-title").innerText = "Успеваемость";
    $(".breadcrumb").innerHTML = `<span onclick="navigate('home')">Главная</span> / <span onclick="navigate('grades')">Успеваемость</span> / Список студентов`;
    app.innerHTML = renderPerformanceView();
    initPerformanceLogic();
  } else if (page === 'portfolio') {
    dashboard.classList.remove("is-home");
    $(".page-title").innerText = "Портфолио выпускников";
    $(".breadcrumb").innerHTML = `<span onclick="navigate('home')">Главная</span> / <span onclick="navigate('portfolio')">Портфолио</span> / Список студентов`;
    app.innerHTML = renderPortfolioView();
    initPortfolioLogic();
  } else if (page === 'about') {
    dashboard.classList.remove("is-home");
    $(".page-title").innerText = "О колледже";
    $(".breadcrumb").innerHTML = `<span onclick="navigate('home')">Главная</span> / О колледже`;
    app.innerHTML = renderAboutView();
  }
}

function mount() {
  const app = $("#app");
  if (!app) return;

  const modalDiv = document.createElement('div');
  modalDiv.id = "fullscreen-view";
  modalDiv.className = "fullscreen-view";
  document.body.appendChild(modalDiv);

  $("#nav-home").onclick = (e) => { e.preventDefault(); navigate('home'); };
  $("#nav-grades").onclick = (e) => { e.preventDefault(); navigate('grades'); };
  $("#nav-portfolio").onclick = (e) => { e.preventDefault(); navigate('portfolio'); };

  navigate('home');
}

window.onload = mount;
