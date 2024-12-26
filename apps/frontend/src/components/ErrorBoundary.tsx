import { useRouteError } from 'react-router-dom';

const isDev = import.meta.env.MODE === 'development';
const baseUrl = isDev ? '/' : '/admin';

export default function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">出错了！</h1>
        <p className="text-gray-600 mb-4">
          {error instanceof Error ? error.message : '发生了未知错误'}
        </p>
        <button
          onClick={() => window.location.href = baseUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
} 