import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';

mkdirSync('./db', { recursive: true });

const db = new Database('./db/app.db');

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    description TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'pending'
                CHECK(status IN ('pending', 'in_progress', 'done')),
    created_at  TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
