'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MainPage from '@/components/pages/MainPage';
import AuthPage from '@/components/auth/AuthPage';
import SignupPage from '@/components/auth/SignupPage';
import PostsListPage from '@/components/posts/PostsListPage';

const API_BASE_URL = 'http://localhost:8080/api';

// 타입 정의
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface File {
  name: string;
  size: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('main');
  const [pageHistory, setPageHistory] = useState(['main']);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const navigateToPage = (page: string) => {
    setPageHistory(prev => [...prev, page]);
    setCurrentPage(page);
    setSelectedFiles([]);
    window.history.pushState({ page }, '', window.location.pathname);
  };

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop();
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setCurrentPage(previousPage);
      window.history.back();
    }
  };

  const validateToken = async (token: string): Promise<User | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.log('Token validation failed:', error.response?.status);
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      validateToken(savedToken).then((userData) => {
        if (userData) {
          setToken(savedToken);
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }).catch((error) => {
        console.log('Token validation error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }

    window.history.replaceState({ page: 'main' }, '', window.location.pathname);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        
        setPageHistory(prev => {
          const newHistory = [...prev];
          if (newHistory[newHistory.length - 1] !== event.state.page) {
            newHistory.push(event.state.page);
          }
          return newHistory;
        });
      } else {
        if (pageHistory.length > 1) {
          const newHistory = [...pageHistory];
          newHistory.pop();
          const previousPage = newHistory[newHistory.length - 1];
          setPageHistory(newHistory);
          setCurrentPage(previousPage);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [pageHistory]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string
      });
      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      navigateToPage('auth');
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
    } catch (error: any) {
      alert('회원가입 실패: ' + (error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.'));
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: formData.get('username') as string,
        password: formData.get('password') as string
      });
      setToken(response.data.accessToken);
      setUser(response.data.user);
      alert('로그인 성공!');
      navigateToPage('posts');
    } catch (error: any) {
      alert('로그인 실패: ' + (error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.'));
    }
    setLoading(false);
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data.content || response.data);
    } catch (error: any) {
      alert('게시글 조회 실패: ' + (error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.'));
    }
  };

  const fetchPost = async (postId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
      setSelectedPost(response.data);
    } catch (error: any) {
      alert('게시글 조회 실패: ' + error.response?.data?.message);
    }
  };

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const postData = {
        title: formData.get('title') as string,
        content: formData.get('content') as string
      };
      
      const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('게시글이 작성되었습니다!');
      navigateToPage('posts');
      fetchPosts();
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      setSelectedFiles([]);
    } catch (error: any) {
      alert('게시글 작성 실패: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !selectedPost) {
      alert('로그인이 필요합니다.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const postData = {
        title: formData.get('title') as string,
        content: formData.get('content') as string
      };
      
      const response = await axios.put(`${API_BASE_URL}/posts/${selectedPost.id}`, postData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert('게시글이 수정되었습니다!');
      navigateToPage('posts');
      fetchPosts();
      setSelectedFiles([]);
    } catch (error: any) {
      alert('게시글 수정 실패: ' + (error.response?.data?.message || error.message));
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeletePost = async (postId: number) => {
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('게시글이 삭제되었습니다!');
      navigateToPage('posts');
      fetchPosts();
    } catch (error: any) {
      alert('게시글 삭제 실패: ' + error.response?.data?.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        token={token}
        currentPage={currentPage}
        navigateToPage={navigateToPage}
        setUser={setUser}
        setToken={(token: string | null) => setToken(token)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Page */}
        {currentPage === 'main' && (
          <MainPage navigateToPage={navigateToPage} />
        )}

        {/* Auth Page */}
        {currentPage === 'auth' && (
          <AuthPage 
            loading={loading}
            handleLogin={handleLogin}
            navigateToPage={navigateToPage}
          />
        )}

        {/* Signup Page */}
        {currentPage === 'signup' && (
          <SignupPage 
            loading={loading}
            handleSignup={handleSignup}
            navigateToPage={navigateToPage}
          />
        )}

        {/* Posts List Page */}
        {currentPage === 'posts' && (
          <PostsListPage 
            posts={posts}
            user={user}
            token={token}
            loading={loading}
            fetchPosts={fetchPosts}
            fetchPost={fetchPost}
            handleDeletePost={handleDeletePost}
            navigateToPage={navigateToPage}
          />
        )}

        {/* Create Post Page */}
        {currentPage === 'create-post' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">게시글 작성</h2>
              <p className="text-gray-600">새로운 게시글을 작성하세요</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="게시글 제목을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    name="content"
                    placeholder="게시글 내용을 입력하세요"
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        파일을 선택하거나 여기에 드래그하세요
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        이미지, PDF, 문서 파일 지원
                      </span>
                    </label>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">선택된 파일:</h4>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? '처리중...' : '작성하기'}
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Post Detail Page */}
        {currentPage === 'post-detail' && selectedPost && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={goBack}
                className="text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                ← 목록으로 돌아가기
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <span>작성자: {selectedPost.authorName}</span>
                  <span>조회수: {selectedPost.viewCount}</span>
                  <span>작성일: {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                  {selectedPost.updatedAt !== selectedPost.createdAt && (
                    <span>수정일: {new Date(selectedPost.updatedAt).toLocaleDateString()}</span>
                  )}
                </div>
                {user && user.username === selectedPost.authorName && (
                  <div className="flex space-x-3 mb-6">
                    <button
                      onClick={() => {
                        if (!token) {
                          alert('로그인이 필요합니다.');
                          navigateToPage('auth');
                        } else {
                          navigateToPage('edit-post');
                        }
                      }}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => {
                        if (!token) {
                          alert('로그인이 필요합니다.');
                          navigateToPage('auth');
                        } else {
                          handleDeletePost(selectedPost.id);
                        }
                      }}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Post Page */}
        {currentPage === 'edit-post' && selectedPost && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={goBack}
                className="text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                ← 상세보기로 돌아가기
              </button>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">게시글 수정</h2>
              <p className="text-gray-600">게시글을 수정하세요</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <form onSubmit={handleUpdatePost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedPost.title}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                  <textarea
                    name="content"
                    defaultValue={selectedPost.content}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">파일 첨부</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="file-upload-edit"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <label
                      htmlFor="file-upload-edit"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        파일을 선택하거나 여기에 드래그하세요
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        이미지, PDF, 문서 파일 지원
                      </span>
                    </label>
                  </div>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">선택된 파일:</h4>
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? '처리중...' : '수정하기'}
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* API Page */}
        {currentPage === 'api' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">API 문서</h2>
              <p className="text-gray-600">사용 가능한 API 엔드포인트를 확인하세요</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">인증 API</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">POST</span>
                        <code className="text-sm font-mono">/api/auth/signup</code>
                      </div>
                      <p className="text-sm text-gray-600">회원가입</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">POST</span>
                        <code className="text-sm font-mono">/api/auth/login</code>
                      </div>
                      <p className="text-sm text-gray-600">로그인</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">GET</span>
                        <code className="text-sm font-mono">/api/auth/me</code>
                      </div>
                      <p className="text-sm text-gray-600">사용자 정보</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">게시글 API</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">GET</span>
                        <code className="text-sm font-mono">/api/posts</code>
                      </div>
                      <p className="text-sm text-gray-600">게시글 목록</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">POST</span>
                        <code className="text-sm font-mono">/api/posts</code>
                      </div>
                      <p className="text-sm text-gray-600">게시글 작성</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">GET</span>
                        <code className="text-sm font-mono">/api/posts/&#123;id&#125;</code>
                      </div>
                      <p className="text-sm text-gray-600">게시글 조회</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded mr-2">GET</span>
                        <code className="text-sm font-mono">/api/posts/search</code>
                      </div>
                      <p className="text-sm text-gray-600">게시글 검색</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

        <Footer />
    </div>
  );
}