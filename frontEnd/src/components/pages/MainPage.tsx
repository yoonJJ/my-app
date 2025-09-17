interface MainPageProps {
  navigateToPage: (page: string) => void;
}

export default function MainPage({ navigateToPage }: MainPageProps) {
  return (
    <div>
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
          FullStack
          <span className="text-blue-600"> 웹 애플리케이션</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Spring Boot와 Next.js로 구축된 완전한 웹 애플리케이션을 경험해보세요.
          JWT 인증, 게시글 관리, 실시간 API 통신까지 모든 기능을 포함합니다.
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 px-4">
          <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Spring Boot</span>
          <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full">Next.js</span>
          <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full">JWT</span>
          <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded-full">TypeScript</span>
          <span className="px-2 sm:px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Tailwind CSS</span>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">JWT 인증</h3>
          <p className="text-sm sm:text-base text-gray-600">안전하고 확장 가능한 JWT 기반 사용자 인증 시스템</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">게시글 관리</h3>
          <p className="text-sm sm:text-base text-gray-600">CRUD 기능을 포함한 완전한 게시글 관리 시스템</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">RESTful API</h3>
          <p className="text-sm sm:text-base text-gray-600">표준화된 REST API 설계로 확장성과 유지보수성 확보</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 rounded-lg p-6 sm:p-8 text-center text-white">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">지금 시작해보세요</h3>
        <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">회원가입하고 모든 기능을 체험해보세요</p>
              <button
                onClick={() => navigateToPage('auth')}
                className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                시작하기
              </button>
      </div>
    </div>
  );
}
