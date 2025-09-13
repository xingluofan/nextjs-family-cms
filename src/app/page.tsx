export default function Home() {
  return (
    <div className="text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          欢迎使用家庭厨房管理系统
        </h1>
        <p className="text-xl text-gray-600">
          让您的厨房生活更加智能化和便捷
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">菜单管理</h3>
          <p className="text-gray-600">管理您的菜谱收藏，记录美味时光</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">记账管理</h3>
          <p className="text-gray-600">记录家庭收支，管理财务状况</p>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-700 mb-2">使用说明</h4>
        <p className="text-gray-600">
          请使用左侧菜单导航到不同的功能模块。您可以点击菜单按钮来收起或展开侧边栏。
        </p>
      </div>
    </div>
  );
}
