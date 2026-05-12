import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { examAPI, problemAPI, Exam, Problem } from '../services/api';
import { Link } from 'react-router-dom';
import { FileText, Plus, Calendar, Clock, BookOpen } from 'lucide-react';

export const ExamsPage = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchExams();
  }, [currentPage]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await examAPI.getAll({ page: currentPage, limit: 10 });
      setExams(response.data.exams);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('获取试卷失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">试卷管理</h1>
            <p className="text-gray-600 mt-1">创建和管理试卷</p>
          </div>
          {user?.role === 'admin' && (
            <Link
              to="/exams/create"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>创建试卷</span>
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <span className={`tag-pill ${exam.judgeMode === 'acm' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {exam.judgeMode === 'acm' ? 'ACM 模式' : 'OI 模式'}
                      </span>
                    </div>
                  </div>

                  {exam.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(exam.startTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(exam.endTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{exam.problems.length} 道题目</span>
                    </div>
                  </div>

                  <Link
                    to={`/exams/${exam._id}`}
                    className="block w-full py-2 text-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && exams.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无试卷</p>
            {user?.role === 'admin' && (
              <Link
                to="/exams/create"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-4"
              >
                <Plus className="h-5 w-5" />
                <span>创建第一张试卷</span>
              </Link>
            )}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8">
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg border ${page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
