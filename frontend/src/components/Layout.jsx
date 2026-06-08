import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isDetail = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
            Gestor de Proyectos
          </Link>
          {isDetail && (
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Volver a proyectos
            </Link>
          )}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
