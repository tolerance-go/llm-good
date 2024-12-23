const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">统计卡片 1</h2>
          <p className="text-gray-600">这里是一些统计数据</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">统计卡片 2</h2>
          <p className="text-gray-600">这里是一些统计数据</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">统计卡片 3</h2>
          <p className="text-gray-600">这里是一些统计数据</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 