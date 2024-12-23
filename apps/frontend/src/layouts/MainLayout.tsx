import { useState, Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems] = useState([
    { id: 1, title: '仪表盘', path: '/' },
    { id: 2, title: '用户管理', path: '/users' },
    { id: 3, title: '设置', path: '/settings' },
  ]);

  const filteredMenuItems = menuItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* 左侧导航 */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 p-4">
        {/* 搜索框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜索菜单..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* 导航菜单 */}
        <nav>
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 p-8 bg-white overflow-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">加载中...</div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default MainLayout; 