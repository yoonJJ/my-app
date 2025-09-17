export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h3 className="text-2xl font-bold">FullStack App</h3>
          </div>
          <p className="text-gray-400 mb-6">
            Spring Boot + Next.js로 구축된 현대적인 웹 애플리케이션
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>Spring Boot 3.5.4</span>
            <span>Next.js 14</span>
            <span>JWT Authentication</span>
            <span>TypeScript</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

