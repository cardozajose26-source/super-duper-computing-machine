import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StatusFilter from '../components/tasks/StatusFilter';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskForm from '../components/tasks/TaskForm';
import { getProject } from '../api/projects';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    getProject(id).then(setProject);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    getTasks(id, statusFilter).then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, [id, statusFilter]);

  const handleCreateTask = async (body) => {
    const created = await createTask(id, body);
    if (statusFilter === 'all' || statusFilter === created.status) {
      setTasks(prev => [created, ...prev]);
    }
    setShowTaskForm(false);
  };

  const handleUpdateTask = async (body) => {
    const updated = await updateTask(id, editingTask.id, body);
    setTasks(prev => {
      const filtered = statusFilter !== 'all' && updated.status !== statusFilter;
      if (filtered) return prev.filter(t => t.id !== updated.id);
      return prev.map(t => t.id === updated.id ? updated : t);
    });
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(id, taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  if (!project) {
    return <div className="text-center py-16 text-gray-400 text-sm">Cargando proyecto...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        {project.description && (
          <p className="text-gray-500 mt-1">{project.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <StatusFilter current={statusFilter} onChange={setStatusFilter} />
        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva tarea
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Cargando tareas...</div>
      ) : (
        <TaskBoard
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
        />
      )}

      {showTaskForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          initialValues={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}
