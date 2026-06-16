// Утилиты
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => (s ?? '').toString().replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// Состояние
let students = [];
let meta = null;
let editingStudent = null;
let editingTab = 'profile';
let editingCourse = 4;

// API
async function api(url, options = {}) {
  const sep = url.includes('?') ? '&' : '?';
  const res = await fetch(`${url}${sep}_=${Date.now()}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'same-origin',
    cache: 'no-store',
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}

// Тост
function toast(msg, type = 'success') {
  const el = $('#toast');
  el.textContent = msg;
  el.style.background = type === 'error' ? '#dc2626' : 'var(--primary)';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// Логин
function showLogin() {
  $('#login-screen').hidden = false;
  $('#admin-app').hidden = true;
}

function showAdmin() {
  $('#login-screen').hidden = true;
  $('#admin-app').hidden = false;
  loadData();
}

async function checkAuth() {
  try {
    await api('/api/auth/me');
    showAdmin();
  } catch {
    showLogin();
  }
}

$('#login-form').onsubmit = async (e) => {
  e.preventDefault();
  $('#login-error').textContent = '';
  try {
    await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: $('#login-user').value.trim(),
        password: $('#login-pass').value
      })
    });
    showAdmin();
  } catch {
    $('#login-error').textContent = 'Неверный логин или пароль';
  }
};

$('#btn-logout').onclick = async () => {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } finally {
    showLogin();
  }
};

// Загрузка данных
async function loadData() {
  try {
    [students, meta] = await Promise.all([api('/api/students'), api('/api/meta')]);
    renderStudentsTable();
  } catch (e) {
    toast('Ошибка загрузки данных', 'error');
    console.error(e);
  }
}

// Рендер таблицы студентов
function renderStudentsTable() {
  const container = $('#students-table');
  if (!students.length) {
    container.innerHTML = `<div style="padding: 48px; text-align: center; color: var(--text-muted);">Нет студентов</div>`;
    return;
  }
  container.innerHTML = students.map((s, idx) => `
    <div class="student-row" style="cursor: default;">
      <div class="student-row__index">${idx + 1}</div>
      <div class="student-row__name">
        ${esc(s.name)}
        <div style="font-size: 11px; color: #94a3b8; font-weight: 400;">
          Тел: ${esc(s.phone)}
        </div>
      </div>
      <div>${esc(s.group)}</div>
      <div>${esc(s.type === 'top' ? 'Отличник' : s.type === 'good_plus' ? 'Хорошист' : 'Слабый')}</div>
      <div>${esc(s.studyForm)}</div>
      <div style="display: flex; gap: 8px;">
        <button class="btn-search" style="padding: 6px 12px; font-size: 12px;" data-action="edit" data-id="${s.id}">✏️ Ред.</button>
        <button class="btn-reset" style="padding: 6px 12px; font-size: 12px; color: #dc2626; border-color: #dc2626;" data-action="delete" data-id="${s.id}">🗑️ Удал.</button>
      </div>
    </div>
  `).join('');

  container.onclick = async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === 'edit') {
      openEditModal(id);
    } else if (btn.dataset.action === 'delete') {
      if (confirm('Удалить студента?')) {
        await deleteStudent(id);
      }
    }
  };
}

// Добавление студента
$('#btn-add-student').onclick = () => {
  $('#add-student-form').style.display = 'block';
};

$('#btn-cancel-new').onclick = () => {
  $('#add-student-form').style.display = 'none';
  $$('#add-student-form input, #add-student-form select').forEach(el => {
    el.value = el.tagName === 'SELECT' ? el.options[0].value : '';
  });
};

$('#btn-save-new').onclick = async () => {
  try {
    await api('/api/students', {
      method: 'POST',
      body: JSON.stringify({
        name: $('#new-name').value.trim(),
        group: $('#new-group').value.trim(),
        phone: $('#new-phone').value.trim(),
        gender: $('#new-gender').value,
        type: $('#new-type').value,
        studyForm: $('#new-form').value,
        studyBase: $('#new-base').value
      })
    });
    toast('Студент добавлен');
    $('#btn-cancel-new').click();
    await loadData();
  } catch (e) {
    toast('Ошибка добавления', 'error');
    console.error(e);
  }
};

// Удаление студента
async function deleteStudent(id) {
  try {
    await api(`/api/students/${id}`, { method: 'DELETE' });
    toast('Студент удалён');
    await loadData();
  } catch (e) {
    toast('Ошибка удаления', 'error');
    console.error(e);
  }
}

// Редактирование
async function openEditModal(id) {
  editingStudent = await api(`/api/students/${id}`);
  editingTab = 'profile';
  editingCourse = 4;
  $('#edit-modal').style.display = 'flex';
  renderEditTabs();
}

$('#close-edit-modal').onclick = () => {
  $('#edit-modal').style.display = 'none';
};

$('#edit-modal').onclick = (e) => {
  if (e.target === $('#edit-modal')) {
    $('#edit-modal').style.display = 'none';
  }
};

$('#edit-tabs').onclick = (e) => {
  const tab = e.target.closest('[data-tab]');
  if (tab) {
    editingTab = tab.dataset.tab;
    renderEditTabs();
  }
};

function renderEditTabs() {
  // Активные табы
  $$('#edit-tabs .admin-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === editingTab);
  });

  const content = $('#edit-tab-content');
  if (editingTab === 'profile') {
    content.innerHTML = `
      <div class="admin-form-grid">
        <div class="admin-field full"><label>ФИО</label><input id="edit-name" value="${esc(editingStudent.name)}"></div>
        <div class="admin-field"><label>Телефон</label><input id="edit-phone" value="${esc(editingStudent.phone)}"></div>
        <div class="admin-field"><label>Группа</label><input id="edit-group" value="${esc(editingStudent.group)}"></div>
        <div class="admin-field"><label>Пол</label>
          <select id="edit-gender">
            <option value="m" ${editingStudent.gender === 'm' ? 'selected' : ''}>М</option>
            <option value="f" ${editingStudent.gender === 'f' ? 'selected' : ''}>Ж</option>
          </select>
        </div>
        <div class="admin-field"><label>Тип</label>
          <select id="edit-type">
            <option value="top" ${editingStudent.type === 'top' ? 'selected' : ''}>Отличник</option>
            <option value="good_plus" ${editingStudent.type === 'good_plus' ? 'selected' : ''}>Хорошист</option>
            <option value="weak" ${editingStudent.type === 'weak' ? 'selected' : ''}>Слабый</option>
          </select>
        </div>
        <div class="admin-field"><label>Форма</label><input id="edit-form" value="${esc(editingStudent.studyForm)}"></div>
        <div class="admin-field"><label>Основа</label><input id="edit-base" value="${esc(editingStudent.studyBase)}"></div>
      </div>
    `;
  } else if (editingTab === 'grades') {
    const subjects = meta?.subjectsByCourse?.[editingCourse] || [];
    const grades = editingStudent.gradesByCourse?.[editingCourse] || {};
    content.innerHTML = `
      <div style="margin-bottom:16px;display:flex;align-items:center;gap:12px;">
        <label style="font-size:13px;font-weight:600;">Курс:</label>
        <select id="grade-course" class="search-select" style="width:auto;">
          ${[1,2,3,4].map(c => `<option value="${c}" ${c === editingCourse ? 'selected' : ''}>${c} курс</option>`).join('')}
        </select>
      </div>
      <div style="overflow-x:auto;">
        <table class="admin-grades-table">
          <thead><tr><th>Дисциплина</th><th>Атт.1</th><th>Атт.2</th><th>Курсовая</th><th>Зачёт</th><th>Экзамен</th></tr></thead>
          <tbody>
            ${subjects.map(sub => {
              const g = grades[sub] || { att1: '', att2: '', kur: '', zach: '', ekz: '' };
              return `
                <tr>
                  <td>${esc(sub)}</td>
                  <td><select data-sub="${esc(sub)}" data-field="att1">${gradeOpts(g.att1)}</select></td>
                  <td><select data-sub="${esc(sub)}" data-field="att2">${gradeOpts(g.att2)}</select></td>
                  <td><select data-sub="${esc(sub)}" data-field="kur">${gradeOpts(g.kur)}</select></td>
                  <td><select data-sub="${esc(sub)}" data-field="zach">${gradeOpts(g.zach)}</select></td>
                  <td><select data-sub="${esc(sub)}" data-field="ekz">${gradeOpts(g.ekz)}</select></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
    $('#grade-course').onchange = (e) => {
      editingCourse = Number(e.target.value);
      renderEditTabs();
    };
  } else if (editingTab === 'portfolio') {
    const p = editingStudent.portfolio;
    const join = arr => (arr || []).join(', ');
    content.innerHTML = `
      <div class="admin-form-grid">
        <div class="admin-field full"><label>О себе</label><textarea id="p-desc" style="min-height: 100px;">${esc(p.description)}</textarea></div>
        <div class="admin-field full"><label>Навыки (через запятую)</label><textarea id="p-skills">${esc(join(p.skills))}</textarea></div>
        <div class="admin-field full"><label>Сильные стороны (через запятую)</label><textarea id="p-strengths">${esc(join(p.strengths))}</textarea></div>
        <div class="admin-field full"><label>Достижения (через запятую)</label><textarea id="p-achievements">${esc(join(p.achievements))}</textarea></div>
        <div class="admin-field full"><label>Проекты (через запятую)</label><textarea id="p-projects">${esc(join(p.projects))}</textarea></div>
      </div>
    `;
  }
}

function gradeOpts(current) {
  const opts = ['', 'отл', 'хор', 'удовл', 'неуд', 'зачет', 'незачет', 'атт'];
  return opts.map(o => `<option value="${o}" ${o === current ? 'selected' : ''}>${o || '—'}</option>`).join('');
}

// Сохранение редактирования
$('#btn-save-edit').onclick = async () => {
  try {
    if (editingTab === 'profile') {
      await api(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: $('#edit-name').value.trim(),
          phone: $('#edit-phone').value.trim(),
          group: $('#edit-group').value.trim(),
          gender: $('#edit-gender').value,
          type: $('#edit-type').value,
          studyForm: $('#edit-form').value.trim(),
          studyBase: $('#edit-base').value.trim()
        })
      });
    } else if (editingTab === 'grades') {
      const grades = {};
      $$('#edit-tab-content [data-sub][data-field]').forEach(el => {
        const sub = el.dataset.sub;
        if (!grades[sub]) grades[sub] = {};
        grades[sub][el.dataset.field] = el.value;
      });
      await api(`/api/students/${editingStudent.id}/grades/${editingCourse}`, {
        method: 'PUT',
        body: JSON.stringify({ grades })
      });
    } else if (editingTab === 'portfolio') {
      const parse = str => str.split(',').map(x => x.trim()).filter(Boolean);
      await api(`/api/students/${editingStudent.id}/portfolio`, {
        method: 'PUT',
        body: JSON.stringify({
          description: $('#p-desc').value.trim(),
          skills: parse($('#p-skills').value),
          strengths: parse($('#p-strengths').value),
          achievements: parse($('#p-achievements').value),
          projects: parse($('#p-projects').value)
        })
      });
    }
    toast('Изменения сохранены');
    await loadData();
  } catch (e) {
    toast('Ошибка сохранения', 'error');
    console.error(e);
  }
};

// Инициализация
checkAuth();
