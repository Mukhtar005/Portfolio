# Каталог студентов + Backend

Веб-платформа «Электронное портфолио» с **SQLite-базой данных** и **админ-панелью**.

## Запуск

```bash
npm install
npm start
```

Откройте в браузере:

- Сайт: http://localhost:3000
- Админ: http://localhost:3000/admin.html

**Логин:** `Mukhtar`  
**Пароль:** `1234`

## Что есть

- Каталог 30 студентов — успеваемость и портфолио
- Данные хранятся в `data/portfolio.db` (SQLite)
- Изменения в админке **сохраняются** после перезапуска сервера
- Редактирование: профиль, оценки по курсам, портфолио

## Структура

- `index.html`, `app.js`, `styles.css` — клиентский сайт
- `admin.html`, `admin.js`, `admin.css` — админ-панель
- `server/index.js` — Express API
- `server/db.js` — SQLite и CRUD
- `data/portfolio.db` — база данных (создаётся автоматически)

## API

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/students` | Все студенты |
| POST | `/api/auth/login` | Вход админа |
| PUT | `/api/students/:id` | Обновить профиль (auth) |
| PUT | `/api/students/:id/grades/:course` | Обновить оценки (auth) |
| PUT | `/api/students/:id/portfolio` | Обновить портфолио (auth) |
