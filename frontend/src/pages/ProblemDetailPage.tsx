import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { problemAPI, judgeAPI, Problem, Submission } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Send, Clock, MemoryStick, CheckCircle, XCircle } from 'lucide-react';

export const ProblemDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [judgeMode, setJudgeMode] = useState<'acm' | 'oi'>('acm');
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions'>('description');

  const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' },
  ];

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const response = await problemAPI.getById(id!);
      setProblem(response.data);
      const template = response.data.templateCode.find(t => t.language === language);
      setCode(template?.code || getDefaultCode(language));
    } catch (error) {
      console.error('获取题目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (lang: string): string => {
    switch (lang) {
      case 'python':
        return `def solve():
    # 在这里编写你的代码
    pass

if __name__ == "__main__":
    solve()
`;
      case 'javascript':
        return `function solve() {
    // 在这里编写你的代码
}

solve();
`;
      case 'typescript':
        return `function solve(): void {
    // 在这里编写你的代码
}

solve();
`;
      case 'cpp':
        return `#include <iostream>
using namespace std;

int main() {
    // 在这里编写你的代码
    return 0;
}
`;
      case 'java':
        return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        // 在这里编写你的代码
    }
}
`;
      case 'c':
        return `#include <stdio.h>

int main() {
    // 在这里编写你的代码
    return 0;
}
`;
      default:
        return '';
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (problem) {
      const template = problem.templateCode.find(t => t.language === newLang);
      setCode(template?.code || getDefaultCode(newLang));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await judgeAPI.submit(id!, code, language, judgeMode);
      setSubmission(response.data);
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'wrong_answer': return 'status-wrong_answer';
      case 'pending': return 'status-pending';
      case 'runtime_error': return 'status-runtime_error';
      case 'time_limit': return 'status-time_limit';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted': return '通过';
      case 'wrong_answer': return '答案错误';
      case 'pending': return '判题中';
      case 'runtime_error': return '运行时错误';
      case 'time_limit': return '超时';
      case 'memory_limit': return '内存超限';
      case 'compile_error': return '编译错误';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">题目不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>返回题库</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{problem.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <span className={`tag-pill ${problem.difficulty === 'easy' ? 'difficulty-easy' : problem.difficulty === 'medium' ? 'difficulty-medium' : 'difficulty-hard'}`}>
                        {problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {problem.type === 'leetcode' ? 'LeetCode' : problem.type === 'multifile' ? '多文件' : 'ACM'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'description' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    题目描述
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`flex-1 px-6 py-3 font-medium transition ${activeTab === 'submissions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    提交记录
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'description' ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">题目描述</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{problem.description}</p>
                    </div>
                    {problem.inputFormat && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">输入格式</h3>
                        <pre className="bg-gray-50 p-4 rounded-lg text-gray-600">{problem.inputFormat}</pre>
                      </div>
                    )}
                    {problem.outputFormat && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">输出格式</h3>
                        <pre className="bg-gray-50 p-4 rounded-lg text-gray-600">{problem.outputFormat}</pre>
                      </div>
                    )}
                    {problem.testCases.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">样例</h3>
                        {problem.testCases.slice(0, 3).map((tc, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">样例 {index + 1}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <span className="text-xs text-gray-500 mb-1 block">输入</span>
                                <pre className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 whitespace-pre-wrap">{tc.input}</pre>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 mb-1 block">输出</span>
                                <pre className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 whitespace-pre-wrap">{tc.output}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {submission ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">判题结果</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(submission.status)}`}>
                            {getStatusLabel(submission.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">得分</span>
                          <span className="text-2xl font-bold text-gray-900">{submission.score}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">判题模式</span>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                            {submission.judgeMode === 'acm' ? 'ACM 模式' : 'OI 模式'}
                          </span>
                        </div>
                        {submission.testResults.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">测试点结果</h4>
                            <div className="space-y-3">
                              {submission.testResults.map((result, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    {result.passed ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-red-600" />
                                    )}
                                    <span className="text-sm text-gray-700">测试点 {index + 1}</span>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">得分: {result.score}</span>
                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                      <Clock className="h-4 w-4" />
                                      <span>{result.time}ms</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">暂无提交记录</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                  <select
                    value={judgeMode}
                    onChange={(e) => setJudgeMode(e.target.value as 'acm' | 'oi')}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="acm">ACM 模式</option>
                    <option value="oi">OI 模式</option>
                  </select>
                </div>
              </div>
              <div className="p-4">
                <Editor
                  height="400px"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    tabSize: 4,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>{submitting ? '提交中...' : '提交代码'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
