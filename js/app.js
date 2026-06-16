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
  };

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
    const copyright = `${site.footerAuthor || "Колледж ДГУ"} @ ${new Date().getFullYear()}`;
    return `
      <footer class="main-footer">
        <div class="footer-inner">
          <div class="footer-copyright">${copyright}</div>
          <div class="footer-links">
            <a href="#" onclick="App.navigate('about'); return false;">О колледже</a>
            <a href="#">Политика конфиденциальности</a>
            <a href="/admin.html">Админ</a>
            <a href="#">Поддержка</a>
          </div>
        </div>
      </footer>`;
  }

  function renderHome() {
    const site = getSite();
    return `
      <div class="home-full">
        <div class="home-hero">
          <h1 style="font-size: 72px; letter-spacing: 0.05em; margin-bottom: 32px; font-weight: 900; text-transform: uppercase;">
            ${esc(site.title || "Электронное портфолио")}
          </h1>
          <p style="font-size: 18px; color: rgba(255,255,255,0.8); margin-bottom: 48px;">
            ${esc(site.subtitle || getDirection())}
          </p>
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
            ${getSkillCategories()
              .filter((cat) => cat.isGroup)
              .map(
                (cat) => `
              <div style="margin-bottom: 40px;">
                <h3 style="font-size: 18px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em;">${esc(cat.title)}</h3>
                <div style="border-left: 3px solid var(--accent); padding-left: 16px; margin-left: 8px;">
                  ${cat.subcategories
                    .map((sub) => {
                      const categoryStudents = getStudentsBySkills(sub.skills);
                      return `
                      <div class="category-card" data-category="${sub.id}" style="margin-bottom: 8px;">
                        <button class="category-toggle" onclick="App.toggleCategory('${sub.id}')">
                          <span style="font-size: 14px; font-weight: 700;">${esc(sub.title)}</span>
                          <svg style="margin-left: auto; transition: transform 0.3s ease;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="category-arrow"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                        <div class="category-content" id="category-content-${sub.id}" style="max-height: 0; overflow: hidden; transition: max-height 0.4s ease;">
                          <div class="category-students">
                            ${
                              categoryStudents.length
                                ? categoryStudents
                                    .map(
                                      (s) => `
                                <div class="category-student" onclick="App.goToStudentPortfolio('${s.id}')">
                                  <div class="category-student-avatar" style="background: var(--accent); color: white; width: 48px; height: 48px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px;">
                                    ${initials(s.name)}
                                  </div>
                                  <div class="category-student-info">
                                    <h4 style="margin: 0; font-size: 14px; font-weight: 700;">${esc(s.name)}</h4>
                                    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                                      ${s.portfolio.strengths
                                        .slice(0, 3)
                                        .map(
                                          (str) =>
                                            `<span style="font-size: 10px; padding: 2px 6px; background: #f1f5f9; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">${esc(str)}</span>`
                                        )
                                        .join("")}
                                    </div>
                                  </div>
                                </div>`
                                    )
                                    .join("")
                                : '<p style="color: var(--text-muted); padding: 20px; font-size:13px;">Пока нет студентов</p>'
                            }
                          </div>
                        </div>
                      </div>`;
                    })
                    .join("")}
                </div>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
      ${renderFooter(true)}`;
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
        </div>
      </div>
      <div class="portfolio-grid" id="portfolio-grid"></div>
      ${renderFooter()}`;
  }

  function renderPortfolioCard(s, idx) {
    const skillsText =
      s.portfolio.skills.slice(0, 3).join(", ") + (s.portfolio.skills.length > 3 ? "..." : "");
    return `
      <div class="portfolio-card" data-portfolio-id="${s.id}" style="animation: fadeIn 0.3s ease ${idx * 0.05}s both;">
        <div class="portfolio-card__header">
          <h3 class="portfolio-name">${esc(s.name)}</h3>
          <p class="portfolio-phone" style="font-size:12px;color:var(--text-muted);margin:4px 0 8px 0;">${esc(s.phone)}</p>
          <p class="portfolio-skills">${esc(skillsText)}</p>
        </div>
      </div>`;
  }

  function renderPortfolioDetail(s) {
    const { skills, strengths, achievements, projects, description } = s.portfolio;
    return `
      <div class="modal-content">
        <div class="modal-header">
          <h2 style="margin: 0;">${esc(s.name)}</h2>
          <button class="btn-close" id="btn-close-portfolio">Закрыть</button>
        </div>
        <div class="modal-body">
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Контакт</h3><p class="portfolio-detail-text">${esc(s.phone)}</p></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">О себе</h3><p class="portfolio-detail-text">${esc(description)}</p></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Навыки</h3><div class="portfolio-tags">${skills.map((x) => `<span class="portfolio-tag">${esc(x)}</span>`).join("")}</div></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Сильные стороны</h3><div class="portfolio-tags">${strengths.map((x) => `<span class="portfolio-tag portfolio-tag--green">${esc(x)}</span>`).join("")}</div></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Достижения</h3><ul class="portfolio-list">${achievements.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
          <div class="portfolio-detail-section"><h3 class="portfolio-detail-title">Проекты</h3><div class="portfolio-tags">${projects.map((x) => `<span class="portfolio-tag portfolio-tag--purple">${esc(x)}</span>`).join("")}</div></div>
        </div>
      </div>`;
  }

  async function openPortfolioDetail(id) {
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

    view.innerHTML = renderPortfolioDetail(student);

    const close = () => {
      view.classList.remove("active");
      setTimeout(() => { view.style.display = "none"; }, 200);
      document.body.style.overflow = "";
    };

    $("#btn-close-portfolio").onclick = close;
    view.onclick = (e) => { if (e.target === view) close(); };
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
    const arrow = card?.querySelector(".category-arrow");
    if (!content) return;

    const isClosed = content.style.maxHeight === "0px" || !content.style.maxHeight;
    content.style.maxHeight = isClosed ? `${content.scrollHeight}px` : "0px";
    if (arrow) arrow.style.transform = isClosed ? "rotate(180deg)" : "rotate(0deg)";
    card?.classList.toggle("category-open", isClosed);
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
      await Promise.all([loadMeta(), refreshStudents()]);
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

  window.App = { navigate, toggleCategory, goToStudentPortfolio, init };
  window.onload = init;
})();
