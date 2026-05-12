import { BookOpen, Code2, FileText, Users, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">OJ Platform</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/problems" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition">
                <BookOpen className="h-5 w-5" />
                <span>题库</span>
              </Link>
              <Link to="/exams" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition">
                <FileText className="h-5 w-5" />
                <span>组卷</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user.username}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {user.role === 'admin' ? '管理员' : '用户'}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">退出</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition">
                  <User className="h-5 w-5" />
                  <span>登录</span>
                </Link>
                <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
