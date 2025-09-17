interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PostsListPageProps {
  posts: Post[];
  user: any;
  token: string | null;
  loading: boolean;
  fetchPosts: () => void;
  fetchPost: (postId: number) => void;
  handleDeletePost: (postId: number) => void;
  navigateToPage: (page: string) => void;
}

export default function PostsListPage({ 
  posts, 
  user, 
  token, 
  loading, 
  fetchPosts, 
  fetchPost, 
  handleDeletePost, 
  navigateToPage 
}: PostsListPageProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">게시글 목록</h2>
          <p className="text-gray-600 text-sm sm:text-base">작성된 게시글들을 확인하세요</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={fetchPosts}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors text-sm sm:text-base"
          >
            새로고침
          </button>
                <button
                  onClick={() => {
                    if (!token) {
                      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                      navigateToPage('auth');
                    } else {
                      navigateToPage('create-post');
                    }
                  }}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  글쓰기
                </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">아직 게시글이 없습니다.</p>
              <p className="text-gray-400">첫 번째 게시글을 작성해보세요!</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">{post.title}</h4>
                <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed line-clamp-3 text-sm sm:text-base">{post.content}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                    <span>작성자: {post.authorName}</span>
                    <span>조회수: {post.viewCount}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:space-x-2">
                    <button
                      onClick={() => {
                        fetchPost(post.id);
                        navigateToPage('post-detail');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      상세보기
                    </button>
                    {user && user.username === post.authorName && (
                      <>
                        <button
                          onClick={() => {
                            if (!token) {
                              alert('로그인이 필요합니다.');
                              navigateToPage('auth');
                            } else {
                              fetchPost(post.id);
                              navigateToPage('edit-post');
                            }
                          }}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            if (!token) {
                              alert('로그인이 필요합니다.');
                              navigateToPage('auth');
                            } else {
                              handleDeletePost(post.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
