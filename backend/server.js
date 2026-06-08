import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/projects', projectsRouter);
app.use('/api/projects/:projectId/tasks', tasksRouter);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
