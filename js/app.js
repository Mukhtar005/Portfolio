/**
 * Главное приложение — SPA на чистом JS с паттернами, близкими к React:
 * единый state, render-функции как компоненты, навигация без перезагрузки.
 */
(() => {
  const { $, esc, getIcon, initials } = AppUtils;
  const api = AppApi;

  const state = {
    students: [],
    meta: null,
    online: false,
    page: "home",
    currentUser: null, // { role: 'student' | 'admin', studentId, name }
  };

  // Дополнительные новости для сайта
  const additionalNews = [
    {
      id: "news1",
      date: "15 июня 2026",
      title: "Команда ДГУ выиграла хакатон «Цифровой прорыв»",
      description: "Студенты заняли первое место в региональном этапе всероссийского хакатона.",
      type: "college",
    },
    {
      id: "news2",
      date: "12 июня 2026",
      title: "Открыта регистрация на летнюю практику",
      description: "Приглашаем студентов 3 курса подать заявки на прохождение практики в IT-компаниях.",
      type: "college",
    },
    {
      id: "news3",
      date: "10 июня 2026",
      title: "Состоялась конференция по информационным технологиям",
      description: "Более 200 участников из разных городов приняли участие в ежегодной конференции.",
      type: "college",
    },
  ];

  const getMeta = () => state.meta || {};
  const getSubjects = (course) => getMeta().subjectsByCourse?.[course] || [];
  const getSkillCategories = () => getMeta().skillCategories || [];
  const getDirection = () => getMeta().directionTitle || "";
  const getSite = () => getMeta().site || {};

  async function refreshStudents() {
    state.students = await api.getStudents();
    await updateStatusBadge();
  }

  async function fetchStudent(id) {
    const student = await api.getStudent(id);
    const idx = state.students.findIndex((s) => s.id === id);
    if (idx >= 0) state.students[idx] = student;
    else state.students.push(student);
    return student;
  }

  async function loadMeta() {
    state.meta = await api.getMeta();
  }

  async function updateStatusBadge() {
    const el = $("#db-status");
    if (!el) return;
    try {
      const st = await api.getStatus();
      state.online = true;
      el.innerHTML = `<span class="db-status__dot"></span> JSON · ${st.students} студ. · ${st.grades} оценок`;
      el.classList.remove("db-status--offline");
    } catch {
      state.online = false;
      el.textContent = "Данные недоступны";
      el.classList.add("db-status--offline");
    }
  }

  async function checkAuth() {
    try {
      const res = await api.fetch("/api/auth/me");
      if (res.ok) {
        state.currentUser = await res.json();
      }
    } catch (e) {
      state.currentUser = null;
    }
  }

  function getStudentsBySkills(skillsList, limit = 6) {
    const match = (skill, target) =>
      skill.toLowerCase().includes(target.toLowerCase());

    return state.students
      .filter((s) =>
        s.portfolio.skills.some((skill) => skillsList.some((t) => match(skill, t)))
      )
      .sort((a, b) => {
        const count = (s) =>
          s.portfolio.skills.filter((skill) => skillsList.some((t) => match(skill, t))).length;
        return count(b) - count(a);
      })
      .slice(0, limit);
  }

  function renderRow(s, idx) {
    return `
      <div class="student-row" data-open="${s.id}">
        <div class="student-row__index">${idx + 1}</div>
        <div class="student-row__name">
          ${esc(s.name)}
          <div style="font-size: 11px; color: #94a3b8; font-weight: 400;">
            Группа ${esc(s.group)} • ${esc(s.studyForm)} • ${esc(s.studyBase)}
          </div>
        </div>
        <div class="student-row__faculty">${esc(s.direction)}</div>
        <div class="student-row__course">${s.courseNow || 4} курс</div>
        <div class="student-row__action"></div>
      </div>`;
  }

  function renderFullscreen(student, courseId) {
    const course = Number(courseId || 4);
    const grades = student.gradesByCourse?.[course] || student.gradesByCourse?.[String(course)] || {};
    const subjectList = getSubjects(course).length ? getSubjects(course) : Object.keys(grades);

    const rows = subjectList
      .map((sub) => {
        const g = grades[sub] || {};
        return `
          <tr>
            <td style="font-weight: 600;">${esc(sub)}</td>
            <td class="tc" style="color: #94a3b8;">${esc(g.att1)}</td>
            <td class="tc" style="color: #94a3b8;">${esc(g.att2)}</td>
            <td class="tc"><span class="grade-val">${esc(g.kur)}</span></td>
            <td class="tc"><span class="grade-val">${esc(g.zach)}</span></td>
            <td class="tc"><span class="grade-val">${esc(g.ekz)}</span></td>
          </tr>`;
      })
      .join("");

    return `
      <div class="modal-content">
        <div class="modal-header">
          <div></div>
          <button class="btn-close" id="btn-close">Закрыть</button>
        </div>
        <div class="modal-profile">
          <div class="profile-avatar-big">
            <img src="${getIcon(student.gender)}" alt="">
          </div>
          <div class="profile-details">
            <h2 style="margin: 0 0 4px; font-size: 24px;">${esc(student.name)}</h2>
            <div style="color: #94a3b8; font-size: 14px;">
              Группа ${esc(student.group)} • ${esc(student.direction)}
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div class="grades-header">
            <h3 style="font-size: 18px; font-weight: 700;">Академическая успеваемость</h3>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="flabel">Курс:</span>
              <select class="select" id="m-course">
                ${[1, 2, 3, 4]
                  .map((c) => `<option value="${c}" ${course === c ? "selected" : ""}>${c} курс</option>`)
                  .join("")}
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
                  <th class="tc" style="width: 80px;">${course === 4 ? "Дип." : "Курс."}</th>
                  <th class="tc" style="width: 100px;">Зачет</th>
                  <th class="tc" style="width: 100px;">Экзамен</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  }

  async function openFullscreen(id, course) {
    const view = $("#fullscreen-view");
    view.style.display = "flex";
    view.innerHTML = `<div class="modal-content" style="padding:40px;text-align:center;color:#64748b;">Загрузка...</div>`;
    view.classList.add("active");
    document.body.style.overflow = "hidden";

    let student;
    try {
      student = await fetchStudent(id);
    } catch (err) {
      view.innerHTML = `<div class="modal-content" style="padding:40px;color:#dc2626;">${esc(err.message)}</div>`;
      return;
    }

    view.innerHTML = renderFullscreen(student, course);

    const close = () => {
      view.classList.remove("active");
      setTimeout(() => { view.style.display = "none"; }, 200);
      document.body.style.overflow = "";
    };

    $("#btn-close").onclick = close;
    $("#m-course").onchange = (e) => openFullscreen(id, e.target.value);
    view.onclick = (e) => { if (e.target === view) close(); };
  }

  function renderFooter(isHome = false) {
    const site = getSite();
    return `
      <footer class="main-footer">
        <div class="footer-inner">
          <div class="footer-left">
            <div class="footer-brand">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #1e40af;">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span class="footer-title">Электронное портфолио</span>
            </div>
            <p class="footer-copyright">© ${new Date().getFullYear()} ${site.footerAuthor || "Колледж ДГУ"}. Все права защищены.</p>
          </div>
          <div class="footer-links">
            <a href="#" onclick="App.navigate('about'); return false;">О колледже</a>
            <a href="#">Политика конфиденциальности</a>
            <a href="/admin.html">Административная панель</a>
          </div>
        </div>
      </footer>`;
  }

  function renderHome() {
    const site = getSite();
    const totalStudents = state.students.length;
    const totalSkills = state.students.reduce((sum, s) => sum + s.portfolio.skills.length, 0);
    const totalProjects = state.students.reduce((sum, s) => sum + s.portfolio.projects.length, 0);

    // Собираем все новости (достижения студентов + дополнительные новости)
    const studentNews = [];
    state.students.forEach(student => {
      student.portfolio.achievements.forEach(achievement => {
        studentNews.push({
          id: `student-${student.id}`,
          date: "17 июня 2026",
          title: esc(achievement),
          description: esc(student.name),
          type: "student",
          student: student,
        });
      });
    });

    const allNews = [...studentNews, ...additionalNews].slice(0, 6);

    return `
      <div class="home-full">
        <div class="home-hero">
          <h1 style="font-size: 64px; letter-spacing: 0.03em; margin-bottom: 24px; font-weight: 800; text-transform: uppercase;">
            ${esc(site.title || "Электронное портфолио")}
          </h1>
          <p style="font-size: 16px; color: rgba(255,255,255,0.85); margin-bottom: 40px; max-width: 600px;">
            ${esc(site.subtitle || getDirection())}
          </p>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-search" style="padding: 14px 32px; font-size: 14px; background: var(--accent); color: white; border: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;" onclick="document.getElementById('nav-portfolio').click()">Портфолио</button>
            <button class="btn-reset" style="padding: 14px 32px; font-size: 14px; border: 1px solid rgba(255, 255, 255, 0.5); color: white; background: transparent; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;" onclick="document.getElementById('nav-grades').click()">Успеваемость</button>
          </div>
        </div>
        <div class="home-categories">
          <div class="home-categories-inner">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 60px;">
              <div style="background: white; border: 1px solid var(--border); padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="font-size: 40px; font-weight: 800; color: var(--accent); margin-bottom: 8px;">${totalStudents}</div>
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Студентов</div>
              </div>
              <div style="background: white; border: 1px solid var(--border); padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="font-size: 40px; font-weight: 800; color: var(--accent); margin-bottom: 8px;">${totalSkills}</div>
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Навыков</div>
              </div>
              <div style="background: white; border: 1px solid var(--border); padding: 24px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);">
                <div style="font-size: 40px; font-weight: 800; color: var(--accent); margin-bottom: 8px;">${totalProjects}</div>
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Проектов</div>
              </div>
            </div>

            <h2 style="text-align: left; font-size: 20px; font-weight: 700; margin-bottom: 28px; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--accent); padding-bottom: 12px;">Компетенции</h2>
            <div style="margin-bottom: 60px;">
              ${getSkillCategories()
                .filter((cat) => cat.isGroup)
                .map(
                  (cat, index, array) => `
                    <div style="margin-bottom: ${index === array.length - 1 ? '0' : '48px'};">
                      <h3 style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">
                        ${esc(cat.title)}
                      </h3>
                      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px;">
                        ${cat.subcategories
                          .map((sub) => {
                            const categoryStudents = getStudentsBySkills(sub.skills);
                            return `
                              <div class="category-card" data-category="${sub.id}" style="border: 1px solid var(--border); overflow: visible; background: white; position: relative;">
                                <button class="category-toggle" onclick="App.toggleCategory('${sub.id}')" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; background: var(--primary); color: white; border: none; cursor: pointer; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; font-size: 12px;">
                                  <span>${esc(sub.title)}</span>
                                  <svg class="category-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.3s ease;">
                                    <path d="M6 9l6 6 6-6"/>
                                  </svg>
                                </button>
                                <div class="category-content" id="category-content-${sub.id}" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease, opacity 0.2s ease, visibility 0.2s ease; position: absolute; top: 100%; left: 0; right: 0; z-index: 100; background: white; border: 1px solid var(--border); border-top: none; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.15);">
                                  <div class="category-students" style="padding: 14px;">
                                    ${
                                      categoryStudents.length
                                        ? categoryStudents
                                            .map(
                                              (s) => `
                                                <div class="category-student" onclick="App.goToStudentPortfolio('${s.id}')" style="display: flex; gap: 12px; align-items: center; padding: 10px; background: var(--bg); border-radius: 8px; cursor: pointer; transition: all 0.15s ease; margin-bottom: 8px;">
                                                  <div class="category-student-avatar" style="background: var(--accent); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">
                                                    ${initials(s.name)}
                                                  </div>
                                                  <div class="category-student-info" style="flex: 1; min-width: 0;">
                                                    <h4 style="margin: 0; font-size: 13px; font-weight: 600; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${esc(s.name)}</h4>
                                                  </div>
                                                </div>
                                              `
                                            )
                                            .join("")
                                        : '<p style="color: var(--text-muted); padding: 16px; font-size:12px; text-align: center;">Пока нет студентов</p>'
                                    }
                                  </div>
                                </div>
                              </div>
                            `;
                          })
                          .join("")}
                      </div>
                      ${index !== array.length - 1 ? `
                        <div style="width: 100%; height: 2px; background: linear-gradient(90deg, transparent, var(--accent), transparent); margin-top: 32px; opacity: 0.5;"></div>
                      ` : ''}
                    </div>
                  `
                )
                .join("")}
            </div>

            <div style="width: 100%; height: 3px; background: linear-gradient(90deg, transparent, var(--accent), transparent); margin-bottom: 48px; opacity: 0.6;"></div>

            <h2 style="text-align: left; font-size: 20px; font-weight: 700; margin-bottom: 28px; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid var(--accent); padding-bottom: 12px;">Последние новости</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
              ${allNews.map(newsItem => `
                <div class="news-card" style="background: white; border: 1px solid var(--border); border-radius: 4px; padding: 20px; transition: all 0.15s ease; display: flex; flex-direction: column; gap: 12px; cursor: pointer;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">${newsItem.date}</span>
                  </div>
                  <h4 style="font-size: 15px; font-weight: 600; color: var(--text-main); margin: 0;">${newsItem.title}</h4>
                  <p style="font-size: 13px; color: var(--text-muted); margin: 0; line-height: 1.5;">${newsItem.description}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      ${renderFooter(true)}
    `;
  }

  function renderPerformanceView() {
    return `
      <div class="search-form">
        <div class="search-row">
          <label>Филиал</label>
          <select class="search-select" id="f-branch"><option value="mkh">г. Махачкала</option></select>
        </div>
        <div class="search-row">
          <label>Факультет</label>
          <select class="search-select" id="f-faculty"><option value="college">Колледж ДГУ</option></select>
        </div>
        <div class="search-row">
          <label>Направление</label>
          <select class="search-select" id="f-direction"><option value="isp">${esc(getDirection())}</option></select>
        </div>
        <div class="search-row"><label>Фамилия</label><input class="search-input" type="text" id="s-lastname" placeholder="Укажите фамилию"></div>
        <div class="search-row"><label>Имя</label><input class="search-input" type="text" id="s-firstname" placeholder="Укажите имя"></div>
        <div class="search-row"><label>Отчество</label><input class="search-input" type="text" id="s-patronymic" placeholder="Укажите отчество"></div>
        <div class="search-actions">
          <button class="btn-search" id="btn-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Поиск
          </button>
          <button class="btn-reset" id="btn-reset">Сбросить</button>
        </div>
      </div>
      <div class="student-list-container">
        <div class="list-header"><div>№</div><div>Студент</div><div>Направление</div><div>Курс</div><div></div></div>
        <div id="tbody"></div>
      </div>
      ${renderFooter()}`;
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Найти
          </button>
          ${state.currentUser 
            ? `<button class="btn-reset" id="logout-btn" style="margin-left:8px;">Выйти (${state.currentUser.firstName})</button>` 
            : `<button class="btn-reset" id="login-btn" style="margin-left:8px;">Войти</button>`
          }
        </div>
      </div>
      <div class="portfolio-grid" id="portfolio-grid"></div>
      ${renderFooter()}`;
  }

  function renderPortfolioCard(s, idx) {
    const skillsText =
      s.portfolio.skills.slice(0, 3).join(", ") + (s.portfolio.skills.length > 3 ? "..." : "");
    const isOwnCard = state.currentUser?.studentId === s.id;
    return `
      <div class="portfolio-card" data-portfolio-id="${s.id}" style="animation: fadeIn 0.3s ease ${idx * 0.05}s both;">
        <div class="portfolio-card__header">
          <h3 class="portfolio-name">${esc(s.name)}</h3>
          <p class="portfolio-phone" style="font-size:12px;color:var(--text-muted);margin:4px 0 8px 0;">${esc(s.phone)}</p>
          <p class="portfolio-skills">${esc(skillsText)}</p>
          ${isOwnCard
            ? `<button onclick="event.stopPropagation(); App.openPortfolioEdit('${s.id}')" style="margin-top: 12px; padding: 8px 16px; background: var(--accent); color: white; border: none; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">Редактировать</button>`
            : ""
          }
        </div>
      </div>`;
  }

  function renderPortfolioDetail(s, isEditing = false) {
    const { skills, strengths, achievements, projects, description } = s.portfolio;
    const isOwnCard = state.currentUser?.studentId === s.id;
    
    if (isEditing && isOwnCard) {
      return `
        <div class="modal-content">
          <div class="modal-header">
            <h2 style="margin: 0;">Редактировать портфолио</h2>
            <button class="btn-close" id="btn-close-portfolio">Закрыть</button>
          </div>
          <div class="modal-body">
            <div class="portfolio-detail-section">
              <label class="portfolio-detail-title" style="display: block; margin-bottom: 8px;">Телефон</label>
              <input type="text" id="edit-phone" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-sans); font-size: 14px;" value="${esc(s.phone)}">
            </div>
            <div class="portfolio-detail-section">
              <label class="portfolio-detail-title" style="display: block; margin-bottom: 8px;">О себе</label>
              <textarea id="edit-description" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-sans); font-size: 14px; min-height: 100px;">${esc(description)}</textarea>
            </div>
            <div class="portfolio-detail-section">
              <label class="portfolio-detail-title" style="display: block; margin-bottom: 8px;">Навыки (через запятую)</label>
              <input type="text" id="edit-skills" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-sans); font-size: 14px;" value="${esc(skills.join(', '))}">
            </div>
            <div class="portfolio-detail-section">
              <label class="portfolio-detail-title" style="display: block; margin-bottom: 8px;">Сильные стороны (через запятую)</label>
              <input type="text" id="edit-strengths" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-sans); font-size: 14px;" value="${esc(strengths.join(', '))}">
            </div>
            <div class="portfolio-detail-section">
              <label class="portfolio-detail-title" style="display: block; margin-bottom: 8px;">Достижения (через запятую)</label>
              <input type="text" id="edit-achievements" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-sans); font-size: 14px;" value="${esc(achievements.join(', '))}">
            </div>
            <div class="portfolio-detail-section">
              <label class="portfolio-detail-title" style="display: block; margin-bottom: 8px;">Проекты (через запятую)</label>
              <input type="text" id="edit-projects" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 4px; font-family: var(--font-sans); font-size: 14px;" value="${esc(projects.join(', '))}">
            </div>
            <div style="margin-top: 24px; display: flex; gap: 12px;">
              <button class="btn-search" id="save-portfolio-btn" style="flex: 1;">Сохранить</button>
              <button class="btn-reset" id="cancel-edit-btn" style="flex: 1;">Отмена</button>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="modal-content">
        <div class="modal-header">
          <h2 style="margin: 0;">${esc(s.name)}</h2>
          <div style="display: flex; gap: 8px;">
            ${isOwnCard 
              ? `<button class="btn-reset" onclick="App.openPortfolioEdit('${s.id}')" style="padding: 8px 16px; font-size: 12px;">Редактировать</button>` 
              : ''
            }
            <button class="btn-close" id="btn-close-portfolio">Закрыть</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Контакт</h3><p class="portfolio-detail-text">${esc(s.phone)}</p></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">О себе</h3><p class="portfolio-detail-text">${esc(description)}</p></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Навыки</h3><div class="portfolio-tags">${skills.map((x) => `<span class="portfolio-tag">${esc(x)}</span>`).join('')}</div></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Сильные стороны</h3><div class="portfolio-tags">${strengths.map((x) => `<span class="portfolio-tag portfolio-tag--green">${esc(x)}</span>`).join('')}</div></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Достижения</h3><ul class="portfolio-list">${achievements.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Проекты</h3><div class="portfolio-tags">${projects.map((x) => `<span class="portfolio-tag portfolio-tag--purple">${esc(x)}</span>`).join('')}</div></div>
        </div>
      </div>`;
  }

  let currentEditingStudent = null;

  async function openPortfolioDetail(id) {
    currentEditingStudent = null;
    const view = $("#fullscreen-view");
    view.style.display = "flex";
    view.innerHTML = `<div class="modal-content" style="padding:40px;text-align:center;color:#64748b;">Загрузка...</div>`;
    view.classList.add("active");
    document.body.style.overflow = "hidden";

    let student;
    try {
      student = await fetchStudent(id);
    } catch (err) {
      view.innerHTML = `<div class="modal-content" style="padding:40px;color:#dc2626;">${esc(err.message)}</div>`;
      return;
    }

    view.innerHTML = renderPortfolioDetail(student, false);
    setupPortfolioDetailEvents(student, view);
  }

  function setupPortfolioDetailEvents(student, view) {
    const close = () => {
      view.classList.remove("active");
      setTimeout(() => { view.style.display = "none"; }, 200);
      document.body.style.overflow = "";
    };

    const closeBtn = $("#btn-close-portfolio");
    if (closeBtn) closeBtn.onclick = close;
    view.onclick = (e) => { if (e.target === view) close(); };

    const saveBtn = $("#save-portfolio-btn");
    if (saveBtn) {
      saveBtn.onclick = async () => {
        const phone = $("#edit-phone").value.trim();
        const description = $("#edit-description").value;
        const skills = $("#edit-skills").value.split(",").map((s) => s.trim()).filter(Boolean);
        const strengths = $("#edit-strengths").value.split(",").map((s) => s.trim()).filter(Boolean);
        const achievements = $("#edit-achievements").value.split(",").map((s) => s.trim()).filter(Boolean);
        const projects = $("#edit-projects").value.split(",").map((s) => s.trim()).filter(Boolean);

        try {
          await api.put(`/api/students/${student.id}/portfolio`, {
            phone,
            description,
            skills,
            strengths,
            achievements,
            projects,
          });
          
          await refreshStudents();
          const updatedStudent = await fetchStudent(student.id);
          view.innerHTML = renderPortfolioDetail(updatedStudent, false);
          setupPortfolioDetailEvents(updatedStudent, view);
        } catch (err) {
          alert(err.message || "Ошибка сохранения");
        }
      };
    }

    const cancelBtn = $("#cancel-edit-btn");
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        view.innerHTML = renderPortfolioDetail(student, false);
        setupPortfolioDetailEvents(student, view);
      };
    }
  }

  async function openPortfolioEdit(id) {
    if (state.currentUser?.studentId !== id) return;
    currentEditingStudent = id;
    const view = $("#fullscreen-view");
    view.style.display = "flex";
    view.innerHTML = `<div class="modal-content" style="padding:40px;text-align:center;color:#64748b;">Загрузка...</div>`;
    view.classList.add("active");
    document.body.style.overflow = "hidden";

    let student;
    try {
      student = await fetchStudent(id);
    } catch (err) {
      view.innerHTML = `<div class="modal-content" style="padding:40px;color:#dc2626;">${esc(err.message)}</div>`;
      return;
    }

    view.innerHTML = renderPortfolioDetail(student, true);
    setupPortfolioDetailEvents(student, view);
  }

  function openStudentLogin() {
    const view = $("#fullscreen-view");
    view.style.display = "flex";
    view.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 style="margin: 0;">Вход для студентов</h2>
          <button class="btn-close" id="btn-close-login">Закрыть</button>
        </div>
        <div class="modal-body">
          <div class="search-form" style="max-width: 100%;">
            <div class="search-row">
              <label>Логин (фамилия)</label>
              <input class="search-input" type="text" id="student-login-input" autocomplete="username">
            </div>
            <div class="search-row">
              <label>Пароль (имя)</label>
              <input class="search-input" type="password" id="student-password-input" autocomplete="current-password">
            </div>
            <div class="search-actions" style="padding-left: 0; margin-top: 12px;">
              <button class="btn-search" id="student-login-submit">Войти</button>
              <button class="btn-reset" id="cancel-login-btn">Отмена</button>
            </div>
            <p id="login-error" style="color: #dc2626; margin-top: 12px; display: none;"></p>
          </div>
        </div>
      </div>`;
    view.classList.add("active");
    document.body.style.overflow = "hidden";

    const close = () => {
      view.classList.remove("active");
      setTimeout(() => { view.style.display = "none"; }, 200);
      document.body.style.overflow = "";
    };

    view.querySelector("#btn-close-login").onclick = close;
    view.querySelector("#cancel-login-btn").onclick = close;
    view.onclick = (e) => { if (e.target === view) close(); };

    const submitLogin = async () => {
      const login = view.querySelector("#student-login-input").value.trim();
      const password = view.querySelector("#student-password-input").value.trim();
      const errorEl = view.querySelector("#login-error");
      errorEl.style.display = "none";

      try {
        const data = await api.post("/api/auth/student-login", { login, password });
        state.currentUser = data;
        close();
        await navigate(state.page);
      } catch (err) {
        errorEl.textContent = err.message || "Ошибка авторизации";
        errorEl.style.display = "block";
      }
    };

    view.querySelector("#student-login-submit").onclick = submitLogin;
    view.querySelector("#student-password-input").onkeydown = (e) => {
      if (e.key === "Enter") submitLogin();
    };
  }

  async function logout() {
    try {
      await api.fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    state.currentUser = null;
    await navigate(state.page);
  }

  function initPerformanceLogic() {
    const update = () => {
      const ln = $("#s-lastname").value.toLowerCase();
      const fn = $("#s-firstname").value.toLowerCase();
      const mn = $("#s-patronymic").value.toLowerCase();

      const list = state.students
        .filter((s) => {
          const parts = s.name.toLowerCase().split(" ");
          return (!ln || (parts[0] || "").includes(ln)) &&
            (!fn || (parts[1] || "").includes(fn)) &&
            (!mn || (parts[2] || "").includes(mn));
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      $("#tbody").innerHTML = list.map((s, idx) => renderRow(s, idx)).join("");
    };

    $("#btn-search").onclick = update;
    $("#btn-reset").onclick = () => {
      ["s-lastname", "s-firstname", "s-patronymic"].forEach((id) => { $(`#${id}`).value = ""; });
      update();
    };
    ["s-lastname", "s-firstname", "s-patronymic"].forEach((id) => {
      $(`#${id}`).onkeydown = (e) => { if (e.key === "Enter") update(); };
    });
    $("#tbody").onclick = (e) => {
      const row = e.target.closest("[data-open]");
      if (row) openFullscreen(row.dataset.open);
    };
    update();
  }

  function initPortfolioLogic() {
    const update = () => {
      const term = $("#portfolio-search")?.value?.toLowerCase() || "";
      const list = state.students.filter((s) => !term || s.name.toLowerCase().includes(term));
      const grid = $("#portfolio-grid");
      if (!grid) return;
      grid.innerHTML = list.map((s, idx) => renderPortfolioCard(s, idx)).join("");
      grid.querySelectorAll("[data-portfolio-id]").forEach((card) => {
        card.onclick = () => openPortfolioDetail(card.dataset.portfolioId);
      });
    };

    const btn = $("#portfolio-btn-search");
    const input = $("#portfolio-search");
    if (btn) btn.onclick = update;
    if (input) input.onkeydown = (e) => { if (e.key === "Enter") update(); };
    
    const loginBtn = $("#login-btn");
    const logoutBtn = $("#logout-btn");
    
    if (loginBtn) loginBtn.onclick = () => openStudentLogin();
    if (logoutBtn) logoutBtn.onclick = () => logout();
    
    update();
  }

  function renderAboutView() {
    return `
      <div style="max-width: 900px; margin: 0 auto;">
        <div class="search-form" style="margin-bottom: 24px;">
          <h3 style="margin-bottom: 16px; font-size: 24px; font-weight: 700;">Колледж ДГУ</h3>
          <p style="margin-bottom: 12px; line-height: 1.6;">Колледж Дагестанского государственного университета — современное учебное заведение, готовящее высококвалифицированных специалистов в области информационных технологий, программирования и других направлений.</p>
        </div>
        <div class="search-form">
          <h4 style="margin-bottom: 12px; font-weight: 700;">Направления подготовки</h4>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li>${esc(getDirection())}</li>
            <li>Информационная безопасность</li>
            <li>Прикладная информатика</li>
            <li>Компьютерные сети</li>
          </ul>
        </div>
        <div class="search-form" style="margin-top: 24px;">
          <h4 style="margin-bottom: 12px; font-weight: 700;">Наши достижения</h4>
          <p style="line-height: 1.6;">Колледж имеет высокие показатели трудоустройства выпускников, активно сотрудничает с ведущими IT-компаниями региона, а также регулярно организует хакатоны, конференции и другие мероприятия для студентов.</p>
        </div>
      </div>
      ${renderFooter()}`;
  }

  async function navigate(page) {
    state.page = page;
    const dashboard = $(".dashboard");
    if (!dashboard) return;

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.id === `nav-${page}`);
    });

    const app = $("#app");
    const needsData = page === "home" || page === "grades" || page === "portfolio";

    if (needsData) {
      app.innerHTML = `<div style="padding:48px;text-align:center;color:var(--text-muted);">Загрузка данных...</div>`;
      try {
        await Promise.all([loadMeta(), refreshStudents()]);
      } catch (err) {
        app.innerHTML = `<div style="padding:48px;text-align:center;color:#dc2626;">${esc(err.message)}</div>`;
        return;
      }
    }

    const titles = {
      home: ["Главная", `<span onclick="App.navigate('home')">Главная</span> / Приветствие`],
      grades: ["Успеваемость", `<span onclick="App.navigate('home')">Главная</span> / <span onclick="App.navigate('grades')">Успеваемость</span> / Список студентов`],
      portfolio: ["Портфолио выпускников", `<span onclick="App.navigate('home')">Главная</span> / <span onclick="App.navigate('portfolio')">Портфолио</span> / Список студентов`],
      about: ["О колледже", `<span onclick="App.navigate('home')">Главная</span> / О колледже`],
    };

    const [title, breadcrumb] = titles[page] || titles.home;
    $(".page-title").innerText = title;
    $(".breadcrumb").innerHTML = breadcrumb;

    dashboard.classList.toggle("is-home", page === "home");

    if (page === "home") app.innerHTML = renderHome();
    else if (page === "grades") { app.innerHTML = renderPerformanceView(); initPerformanceLogic(); }
    else if (page === "portfolio") { app.innerHTML = renderPortfolioView(); initPortfolioLogic(); }
    else if (page === "about") app.innerHTML = renderAboutView();
  }

  function toggleCategory(categoryId) {
    const content = document.getElementById(`category-content-${categoryId}`);
    const card = document.querySelector(`.category-card[data-category="${categoryId}"]`);
    const arrow = card?.querySelector('.category-arrow');
    
    if (!content) return;

    const isClosed = content.style.maxHeight === "0px" || !content.style.maxHeight;
    
    // Close all other categories first
    document.querySelectorAll('.category-card').forEach(c => {
      if (c !== card) {
        const otherContent = c.querySelector('.category-content');
        const otherArrow = c.querySelector('.category-arrow');
        if (otherContent) {
          otherContent.style.maxHeight = "0px";
          otherContent.style.opacity = "0";
          otherContent.style.visibility = "hidden";
          otherContent.style.transform = "translateY(-8px)";
        }
        if (otherArrow) otherArrow.style.transform = "rotate(0deg)";
        c.classList.remove('category-open');
      }
    });

    // Toggle the clicked category
    content.style.maxHeight = isClosed ? `${content.scrollHeight}px` : "0px";
    card?.classList.toggle("category-open", isClosed);
    
    if (arrow) {
      arrow.style.transform = isClosed ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    
    if (isClosed) {
      content.style.opacity = "1";
      content.style.visibility = "visible";
      content.style.transform = "translateY(0)";
    } else {
      content.style.opacity = "0";
      content.style.visibility = "hidden";
      content.style.transform = "translateY(-8px)";
    }
  }

  function goToStudentPortfolio(studentId) {
    navigate("portfolio").then(() => openPortfolioDetail(studentId));
  }

  function mount() {
    if (!document.getElementById("fullscreen-view")) {
      const modal = document.createElement("div");
      modal.id = "fullscreen-view";
      modal.className = "fullscreen-view";
      document.body.appendChild(modal);
    }

    // Click outside handler for categories
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.category-card')) {
        document.querySelectorAll('.category-card').forEach(c => {
          const content = c.querySelector('.category-content');
          const arrow = c.querySelector('.category-arrow');
          if (content) {
            content.style.maxHeight = "0px";
            content.style.opacity = "0";
            content.style.visibility = "hidden";
          }
          if (arrow) arrow.style.transform = "rotate(0deg)";
          c.classList.remove('category-open');
        });
      }
    });

    $("#nav-home").onclick = (e) => { e.preventDefault(); navigate("home"); };
    $("#nav-grades").onclick = (e) => { e.preventDefault(); navigate("grades"); };
    $("#nav-portfolio").onclick = (e) => { e.preventDefault(); navigate("portfolio"); };

    navigate("home");
    window.addEventListener("focus", () => {
      if (state.online) refreshStudents().catch(() => {});
    });
  }

  async function init() {
    const app = $("#app");
    if (!app) return;

    app.innerHTML = `<div style="padding:48px;text-align:center;color:var(--text-muted);">Загрузка данных...</div>`;

    try {
      await Promise.all([loadMeta(), refreshStudents(), checkAuth()]);
      mount();
    } catch (err) {
      app.innerHTML = `
        <div style="padding:48px;text-align:center;max-width:520px;margin:0 auto;">
          <h3 style="margin-bottom:12px;">Не удалось подключиться к серверу</h3>
          <p style="color:var(--text-muted);margin-bottom:20px;">Запустите сервер командой <code>npm start</code> и откройте <a href="http://localhost:3000">http://localhost:3000</a></p>
          <p style="color:#dc2626;font-size:14px;">${esc(err.message)}</p>
        </div>`;
    }
  }

  window.App = { navigate, toggleCategory, goToStudentPortfolio, init, openStudentLogin, logout, openPortfolioEdit };
  window.onload = init;
})();
