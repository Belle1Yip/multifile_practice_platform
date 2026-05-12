import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI, problemAPI, Exam, Problem } from '../services/api';
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react';

export const CreateExamPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problems: [] as { problemId: string; score: number; order: number }[],
    startTime: '',
    endTime: '',
    judgeMode: 'acm' as 'acm' | 'oi'
  });
  
  const [availableProblems, setAvailableProblems] = useState<Problem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  const [problemScore, setProblemScore] = useState(100);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await problemAPI.getAll({ limit: 50 });
      setAvailableProblems(response.data.problems);
    } catch (error) {
      console.error('获取题目失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.problems.length === 0) {
      setError('请至少添加一道题目');
      return;
    }

    try {
      await examAPI.create(formData);
      navigate('/exams');
    } catch (err: any) {
      setError(err.response?.data?.message || '创建失败');
    }
  };

  const addProblem = () => {
    if (!selectedProblem) return;
    
    if (formData.problems.some(p => p.problemId === selectedProblem)) {
      setError('该题目已添加');
      return;
    }

    const newProblem = {
      problemId: selectedProblem,
      score: problemScore,
      order: formData.problems.length + 1
    };
    
    setFormData({ ...formData, problems: [...formData.problems, newProblem] });
    setSelectedProblem('');
    setProblemScore(100);
    setError('');
  };

  const removeProblem = (index: number) => {
    const newProblems = formData.problems.filter((_, i) => i !== index);
    const reorderdProblems = newProblems.map((p, i) => ({ ...p, order: i + 1 }));
    setFormData({ ...formData, problems: reorderdProblems });
  };

  const updateProblemScore = (index: number, score: number) => {
    const newProblems = [...formData.problems];
    newProblems[index].score = score;
    setFormData({ ...formData, problems: newProblems });
  };

  const getProblemById = (id: string) => {
    return availableProblems.find(p => p._id === id);
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/exams')}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>返回试卷列表</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">创建试卷</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">试卷标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="请输入试卷标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">试卷描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="请输入试卷描述（可选）"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">判题模式</label>
              <select
                value={formData.judgeMode}
                onChange={(e) => setFormData({ ...formData, judgeMode: e.target.value as 'acm' | 'oi' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="acm">ACM 模式（全对得满分）</option>
                <option value="oi">OI 模式（按测试点得分）</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">添加题目</label>
              </div>
              
              {formData.problems.length === 0 ? (
                <div className="p-8 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-500">暂无题目，请从下方选择题目添加</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {formData.problems.map((problem, index) => {
                    const problemData = getProblemById(problem.problemId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {problem.order}
                          </span>
                          <div>
                            <span className="font-medium text-gray-900">{problemData?.title || '未知题目'}</span>
                            {problemData && (
                              <span className={`ml-2 tag-pill ${getDifficultyClass(problemData.difficulty)}`}>
                                {problemData.difficulty === 'easy' ? '简单' : problemData.difficulty === 'medium' ? '中等' : '困难'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">分值:</span>
                            <input
                              type="number"
                              value={problem.score}
                              onChange={(e) => updateProblemScore(index, Number(e.target.value))}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProblem(index)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={selectedProblem}
                      onChange={(e) => setSelectedProblem(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">选择题目...</option>
                      {availableProblems
                        .filter(p => !formData.problems.some(existing => existing.problemId === p._id))
                        .map((problem) => (
                          <option key={problem._id} value={problem._id}>
                            {problem.title} ({problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">分值:</span>
                    <input
                      type="number"
                      value={problemScore}
                      onChange={(e) => setProblemScore(Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addProblem}
                    disabled={!selectedProblem}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>添加</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/exams')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                创建试卷
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
