const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'done', label: 'Completada' },
];

export default function StatusFilter({ current, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map(f => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            current === f.value
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
