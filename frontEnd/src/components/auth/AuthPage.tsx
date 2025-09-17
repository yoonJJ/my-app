interface AuthPageProps {
  loading: boolean;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  navigateToPage: (page: string) => void;
}

export default function AuthPage({ loading, handleLogin, navigateToPage }: AuthPageProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">로그인</h2>
        <p className="text-gray-600">계정으로 로그인하여 서비스를 이용하세요</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">사용자명</label>
            <input
              type="text"
              name="username"
              placeholder="사용자명을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '처리중...' : '로그인'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">아직 계정이 없으신가요?</p>
                <button
                  onClick={() => navigateToPage('signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  회원가입하기
                </button>
        </div>
      </div>
    </div>
  );
}
