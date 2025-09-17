interface SignupPageProps {
  loading: boolean;
  handleSignup: (e: React.FormEvent<HTMLFormElement>) => void;
  navigateToPage: (page: string) => void;
}

export default function SignupPage({ loading, handleSignup, navigateToPage }: SignupPageProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">회원가입</h2>
        <p className="text-gray-600">새로운 계정을 만들어 서비스를 시작하세요</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSignup} className="space-y-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
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
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '처리중...' : '회원가입'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-4">이미 계정이 있으신가요?</p>
                <button
                  onClick={() => navigateToPage('auth')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  로그인하기
                </button>
        </div>
      </div>
    </div>
  );
}
