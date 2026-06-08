import { Router } from 'express';
import db from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  const projects = db.prepare(`
    SELECT p.*, COUNT(t.id) as task_count
    FROM projects p
    LEFT JOIN tasks t ON t.project_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(projects);
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }
  const result = db.prepare(
    'INSERT INTO projects (name, description) VALUES (?, ?)'
  ).run(name.trim(), description?.trim() || null);
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(project);
});

router.get('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.json(project);
});

router.put('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const name = req.body.name !== undefined ? req.body.name.trim() : project.name;
  const description = req.body.description !== undefined
    ? req.body.description.trim() || null
    : project.description;

  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });

  db.prepare('UPDATE projects SET name = ?, description = ? WHERE id = ?')
    .run(name, description, req.params.id);
  res.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.status(204).send();
});

export default router;
