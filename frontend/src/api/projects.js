const BASE = 'http://localhost:3001/api';

export const getProjects = () =>
  fetch(`${BASE}/projects`).then(r => r.json());

export const createProject = (body) =>
  fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

export const updateProject = (id, body) =>
  fetch(`${BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

export const deleteProject = (id) =>
  fetch(`${BASE}/projects/${id}`, { method: 'DELETE' });

export const getProject = (id) =>
  fetch(`${BASE}/projects/${id}`).then(r => r.json());
