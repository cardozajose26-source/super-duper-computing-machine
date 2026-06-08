import { Router } from 'express';
import db from '../database.js';

const router = Router({ mergeParams: true });

const VALID_STATUSES = ['pending', 'in_progress', 'done'];

router.get('/', (req, res) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const { status } = req.query;
  let tasks;
  if (status && VALID_STATUSES.includes(status)) {
    tasks = db.prepare(
      'SELECT * FROM tasks WHERE project_id = ? AND status = ? ORDER BY created_at DESC'
    ).all(req.params.projectId, status);
  } else {
    tasks = db.prepare(
      'SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at DESC'
    ).all(req.params.projectId);
  }
  res.json(tasks);
});

router.post('/', (req, res) => {
  const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(req.params.projectId);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const { title, description, status } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }
  const taskStatus = VALID_STATUSES.includes(status) ? status : 'pending';
  const result = db.prepare(
    'INSERT INTO tasks (project_id, title, description, status) VALUES (?, ?, ?, ?)'
  ).run(req.params.projectId, title.trim(), description?.trim() || null, taskStatus);
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

router.put('/:id', (req, res) => {
  const task = db.prepare(
    'SELECT * FROM tasks WHERE id = ? AND project_id = ?'
  ).get(req.params.id, req.params.projectId);
  if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });

  const title = req.body.title !== undefined ? req.body.title.trim() : task.title;
  const description = req.body.description !== undefined
    ? req.body.description.trim() || null
    : task.description;
  const status = VALID_STATUSES.includes(req.body.status) ? req.body.status : task.status;

  if (!title) return res.status(400).json({ error: 'El título es obligatorio' });

  db.prepare('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?')
    .run(title, description, status, req.params.id);
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare(
    'DELETE FROM tasks WHERE id = ? AND project_id = ?'
  ).run(req.params.id, req.params.projectId);
  if (result.changes === 0) return res.status(404).json({ error: 'Tarea no encontrada' });
  res.status(204).send();
});

export default router;
