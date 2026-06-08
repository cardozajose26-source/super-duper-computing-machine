const BASE = 'http://localhost:3001/api';

export const getTasks = (projectId, status) => {
  const url = status && status !== 'all'
    ? `${BASE}/projects/${projectId}/tasks?status=${status}`
    : `${BASE}/projects/${projectId}/tasks`;
  return fetch(url).then(r => r.json());
};

export const createTask = (projectId, body) =>
  fetch(`${BASE}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

export const updateTask = (projectId, id, body) =>
  fetch(`${BASE}/projects/${projectId}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

export const deleteTask = (projectId, id) =>
  fetch(`${BASE}/projects/${projectId}/tasks/${id}`, { method: 'DELETE' });
