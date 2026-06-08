import { useState, useEffect } from 'react';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (body) => {
    const created = await createProject(body);
    setProjects(prev => [{ ...created, task_count: 0 }, ...prev]);
    setShowForm(false);
  };

  const handleUpdate = async (body) => {
    const updated = await updateProject(editingProject.id, body);
    setProjects(prev =>
      prev.map(p => p.id === updated.id ? { ...updated, task_count: p.task_count } : p)
    );
    setEditingProject(null);
  };

  const handleDelete = async (id) => {
    await deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo proyecto
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Cargando proyectos...</div>
      ) : (
        <ProjectList
          projects={projects}
          onEdit={setEditingProject}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <ProjectForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingProject && (
        <ProjectForm
          initialValues={editingProject}
          onSubmit={handleUpdate}
          onCancel={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}
