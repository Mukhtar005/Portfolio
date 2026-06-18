console.log("admin.js loaded");

const $ = (sel, root = document) => {
  const el = root.querySelector(sel);
  console.log(`querySelector ${sel}:`, el);
  return el;
};
const esc = (s) =>
  (s ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

let students = [];
let subjectsByCourse = {};
let siteMeta = null;
let selectedId = null;
let activeTab = "profile";
let activeCourse = 4;

async function api(url, options = {}) {
  console.log("api called with:", url, options);
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}_=${Date.now()}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "same-origin",
    cache: "no-store",
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  console.log("api response:", { ok: res.ok, data });
  if (!res.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

function toast(msg) {
  console.log("toast:", msg);
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2500);
}

function showLogin() {
  console.log("showLogin called");
  $("#login-screen").hidden = false;
  $("#admin-app").hidden = true;
}

function showAdmin(username) {
  console.log("showAdmin called with:", username);
  $("#login-screen").hidden = true;
  $("#admin-app").hidden = false;
  $("#admin-user").textContent = username;
}

async function checkAuth() {
  console.log("checkAuth called");
  try {
    const me = await api("/api/auth/me");
    showAdmin(me.username);
    await loadData();
    return true;
  } catch (err) {
    console.log("checkAuth failed:", err);
    showLogin();
    return false;
  }
}

async function loadData() {
  console.log("loadData called");
  const [list, meta] = await Promise.all([api("/api/students"), api("/api/meta")]);
  students = list;
  subjectsByCourse = meta.subjectsByCourse;
  siteMeta = meta;
  renderStudentList();
  if (selectedId) renderEditor();
}

function renderStudentList() {
  console.log("renderStudentList called");
  const q = ($("#student-filter").value || "").toLowerCase();
  const list = students.filter((s) => !q || s.name.toLowerCase().includes(q));
  $("#student-list").innerHTML = list
    .map(
      (s) => `
    <div class="admin-student-item ${s.id === selectedId ? "active" : ""}" data-id="${s.id}">
      ${esc(s.name)}
      <small>Группа ${esc(s.group)} • ${esc(s.type)}</small>
    </div>`
    )
    .join("");

  $("#student-list").querySelectorAll("[data-id]").forEach((el) => {
    el.onclick = () => {
      selectedId = el.dataset.id;
      activeTab = "profile";
      renderStudentList();
      renderEditor();
    };
  });
}

function gradeOptions(current) {
  const opts = ["", "отл", "хор", "удовл", "неуд", "зачет", "незачет", "атт"];
  return opts
    .map((o) => `<option value="${o}" ${o === current ? "selected" : ""}>${o || "—"}</option>`)
    .join("");
}

function renderEditor() {
  console.log("renderEditor called, activeTab:", activeTab);
  const main = $("#admin-main");

  if (activeTab === "settings") {
    main.innerHTML = `
      <div class="admin-panel">
        <h2>Настройки сайта</h2>
        <p class="admin-panel__sub">Изменения сохраняются в data/meta.json</p>
        <div class="admin-tabs">
          <button class="admin-tab" data-tab="profile">Профиль</button>
          <button class="admin-tab" data-tab="grades">Оценки</button>
          <button class="admin-tab" data-tab="portfolio">Портфолио</button>
          <button class="admin-tab active" data-tab="settings">Сайт</button>
        </div>
        <div id="tab-content">${renderSettingsTab()}</div>
      </div>`;
    main.querySelectorAll("[data-tab]").forEach((btn) => {
      btn.onclick = () => {
        activeTab = btn.dataset.tab;
        if (activeTab === "settings") renderEditor();
        else if (selectedId) renderEditor();
        else toast("Сначала выберите студента");
      };
    });
    bindSettingsEvents();
    return;
  }

  const s = students.find((x) => x.id === selectedId);
  if (!s) {
    main.innerHTML = `
      <p class="admin-placeholder">Выберите студента слева или откройте вкладку «Сайт»</p>
      <div class="admin-actions"><button class="btn-search" id="open-settings">Настройки сайта</button></div>`;
    $("#open-settings").onclick = () => { activeTab = "settings"; renderEditor(); };
    return;
  }

  main.innerHTML = `
    <div class="admin-panel">
      <h2>${esc(s.name)}</h2>
      <p class="admin-panel__sub">ID: ${esc(s.id)} • Группа ${esc(s.group)} • ${esc(s.direction)}</p>

      <div class="admin-tabs">
        <button class="admin-tab ${activeTab === "profile" ? "active" : ""}" data-tab="profile">Профиль</button>
        <button class="admin-tab ${activeTab === "grades" ? "active" : ""}" data-tab="grades">Оценки</button>
        <button class="admin-tab ${activeTab === "portfolio" ? "active" : ""}" data-tab="portfolio">Портфолио</button>
        <button class="admin-tab ${activeTab === "settings" ? "active" : ""}" data-tab="settings">Сайт</button>
      </div>

      <div id="tab-content"></div>
    </div>
  `;

  main.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.onclick = () => {
      activeTab = btn.dataset.tab;
      renderEditor();
    };
  });
  const content = $("#tab-content");
  if (activeTab === "profile") content.innerHTML = renderProfileTab(s);
  else if (activeTab === "grades") content.innerHTML = renderGradesTab(s);
  else if (activeTab === "portfolio") content.innerHTML = renderPortfolioTab(s);
  else if (activeTab === "settings") content.innerHTML = renderSettingsTab();

  bindTabEvents(s);
}

function renderSettingsTab() {
  const site = siteMeta?.site || {};
  return `
    <div class="admin-form-grid">
      <div class="admin-field full"><label>Заголовок главной</label><input id="site-title" value="${esc(site.title || "")}" /></div>
      <div class="admin-field full"><label>Подзаголовок</label><input id="site-subtitle" value="${esc(site.subtitle || "")}" /></div>
      <div class="admin-field"><label>Автор в футере</label><input id="site-author" value="${esc(site.footerAuthor || "")}" /></div>
      <div class="admin-field full"><label>Направление</label><input id="site-direction" value="${esc(siteMeta?.directionTitle || "")}" /></div>
    </div>
    <div class="admin-actions"><button class="btn-search" id="save-settings">Сохранить настройки</button></div>
  `;
}

function renderProfileTab(s) {
  return `
    <div class="admin-form-grid">
      <div class="admin-field full"><label>ФИО</label><input id="f-name" value="${esc(s.name)}" /></div>
      <div class="admin-field"><label>Телефон</label><input id="f-phone" value="${esc(s.phone)}" /></div>
      <div class="admin-field"><label>Группа</label><input id="f-group" value="${esc(s.group)}" /></div>
      <div class="admin-field"><label>Пол</label>
        <select id="f-gender"><option value="m" ${s.gender === "m" ? "selected" : ""}>М</option><option value="f" ${s.gender === "f" ? "selected" : ""}>Ж</option></select>
      </div>
      <div class="admin-field"><label>Тип успеваемости</label>
        <select id="f-type">
          <option value="top" ${s.type === "top" ? "selected" : ""}>Отличник</option>
          <option value="good_plus" ${s.type === "good_plus" ? "selected" : ""}>Хорошист</option>
          <option value="weak" ${s.type === "weak" ? "selected" : ""}>Слабый</option>
        </select>
      </div>
      <div class="admin-field"><label>Форма обучения</label><input id="f-form" value="${esc(s.studyForm)}" /></div>
      <div class="admin-field"><label>Основа обучения</label><input id="f-base" value="${esc(s.studyBase)}" /></div>
    </div>
    <div class="admin-actions"><button class="btn-search" id="save-profile">Сохранить профиль</button></div>
  `;
}

function renderGradesTab(s) {
  const subjects = subjectsByCourse[activeCourse] || [];
  const grades = s.gradesByCourse?.[activeCourse] || {};

  const rows = subjects
    .map((sub) => {
      const g = grades[sub] || {};
      return `
      <tr>
        <td>${esc(sub)}</td>
        <td><select data-subject="${esc(sub)}" data-field="att1">${gradeOptions(g.att1)}</select></td>
        <td><select data-subject="${esc(sub)}" data-field="att2">${gradeOptions(g.att2)}</select></td>
        <td><select data-subject="${esc(sub)}" data-field="kur">${gradeOptions(g.kur)}</select></td>
        <td><select data-subject="${esc(sub)}" data-field="zach">${gradeOptions(g.zach)}</select></td>
        <td><select data-subject="${esc(sub)}" data-field="ekz">${gradeOptions(g.ekz)}</select></td>
      </tr>`;
    })
    .join("");

  return `
    <div style="margin-bottom:16px;display:flex;align-items:center;gap:12px;">
      <label style="font-size:13px;font-weight:600;">Курс:</label>
      <select id="grade-course" class="search-select" style="width:auto;">
        ${[1, 2, 3, 4].map((c) => `<option value="${c}" ${c === activeCourse ? "selected" : ""}>${c} курс</option>`).join("")}
      </select>
    </div>
    <div style="overflow-x:auto;">
      <table class="admin-grades-table">
        <thead><tr><th>Дисциплина</th><th>Атт.1</th><th>Атт.2</th><th>Курсовая</th><th>Зачёт</th><th>Экзамен</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="admin-actions"><button class="btn-search" id="save-grades">Сохранить оценки</button></div>
  `;
}

function renderPortfolioTab(s) {
  const p = s.portfolio;
  const join = (arr) => (arr || []).join(", ");
  return `
    <div class="admin-form-grid">
      <div class="admin-field full"><label>О себе</label><textarea id="p-desc">${esc(p.description)}</textarea></div>
      <div class="admin-field full"><label>Навыки (через запятую)</label><textarea id="p-skills">${esc(join(p.skills))}</textarea></div>
      <div class="admin-field full"><label>Сильные стороны (через запятую)</label><textarea id="p-strengths">${esc(join(p.strengths))}</textarea></div>
      <div class="admin-field full"><label>Достижения (через запятую)</label><textarea id="p-achievements">${esc(join(p.achievements))}</textarea></div>
      <div class="admin-field full"><label>Проекты (через запятую)</label><textarea id="p-projects">${esc(join(p.projects))}</textarea></div>
    </div>
    <div class="admin-actions"><button class="btn-search" id="save-portfolio">Сохранить портфолио</button></div>
  `;
}

function parseList(str) {
  return str
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function bindSettingsEvents() {
  const saveBtn = $("#save-settings");
  if (!saveBtn) return;
  saveBtn.onclick = async () => {
    try {
      siteMeta = await api("/api/meta", {
        method: "PUT",
        body: JSON.stringify({
          ...siteMeta,
          directionTitle: $("#site-direction").value.trim(),
          site: {
            ...siteMeta.site,
            title: $("#site-title").value.trim(),
            subtitle: $("#site-subtitle").value.trim(),
            footerAuthor: $("#site-author").value.trim(),
          },
        }),
      });
      toast("Настройки сохранены");
    } catch (e) {
      toast(e.message);
    }
  };
}

function bindTabEvents(s) {
  if (activeTab === "settings") {
    bindSettingsEvents();
    return;
  }
  const saveProfile = $("#save-profile");
  if (saveProfile) {
    saveProfile.onclick = async () => {
      try {
        const updated = await api(`/api/students/${s.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: $("#f-name").value.trim(),
            phone: $("#f-phone").value.trim(),
            group: $("#f-group").value.trim(),
            gender: $("#f-gender").value,
            type: $("#f-type").value,
            studyForm: $("#f-form").value.trim(),
            studyBase: $("#f-base").value.trim(),
          }),
        });
        replaceStudent(updated);
        toast("Профиль сохранён");
        renderStudentList();
        renderEditor();
      } catch (e) {
        toast(e.message);
      }
    };
  }

  const courseSel = $("#grade-course");
  if (courseSel) {
    courseSel.onchange = () => {
      activeCourse = Number(courseSel.value);
      renderEditor();
    };
  }

  const saveGrades = $("#save-grades");
  if (saveGrades) {
    saveGrades.onclick = async () => {
      const grades = {};
      document.querySelectorAll("[data-subject][data-field]").forEach((el) => {
        const sub = el.dataset.subject;
        if (!grades[sub]) grades[sub] = {};
        grades[sub][el.dataset.field] = el.value;
      });
      try {
        const updated = await api(`/api/students/${s.id}/grades/${activeCourse}`, {
          method: "PUT",
          body: JSON.stringify({ grades }),
        });
        replaceStudent(updated);
        toast("Оценки сохранены");
      } catch (e) {
        toast(e.message);
      }
    };
  }

  const savePortfolio = $("#save-portfolio");
  if (savePortfolio) {
    savePortfolio.onclick = async () => {
      try {
        const updated = await api(`/api/students/${s.id}/portfolio`, {
          method: "PUT",
          body: JSON.stringify({
            description: $("#p-desc").value.trim(),
            skills: parseList($("#p-skills").value),
            strengths: parseList($("#p-strengths").value),
            achievements: parseList($("#p-achievements").value),
            projects: parseList($("#p-projects").value),
          }),
        });
        replaceStudent(updated);
        toast("Портфолио сохранено");
      } catch (e) {
        toast(e.message);
      }
    };
  }
}

function replaceStudent(updated) {
  const idx = students.findIndex((x) => x.id === updated.id);
  if (idx >= 0) students[idx] = updated;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");
  const loginForm = $("#login-form");
  console.log("loginForm:", loginForm);
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      console.log("login form submitted");
      e.preventDefault();
      $("#login-error").textContent = "";
      const username = $("#login-user").value.trim();
      const password = $("#login-pass").value;
      console.log("credentials:", { username, password });
      try {
        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        });
        showAdmin(data.username);
        await loadData();
      } catch (err) {
        console.error("login failed:", err);
        $("#login-error").textContent = "Неверный логин или пароль";
      }
    };
  }

  const logoutBtn = $("#btn-logout");
  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await api("/api/auth/logout", { method: "POST" });
      selectedId = null;
      showLogin();
    };
  }

  const filterInput = $("#student-filter");
  if (filterInput) {
    filterInput.oninput = renderStudentList;
  }

  checkAuth();
});
