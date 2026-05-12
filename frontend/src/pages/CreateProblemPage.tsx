import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { problemAPI, aiAPI } from '../services/api';
import { ArrowLeft, Plus, Trash2, Sparkles } from 'lucide-react';

export const CreateProblemPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    type: 'leetcode' as 'leetcode' | 'multifile' | 'acm',
    tags: [] as string[],
    inputFormat: '',
    outputFormat: '',
    testCases: [{ input: '', output: '', score: 0 }],
    templateCode: [{ language: 'python', code: '' }]
  });
  
  const [newTag, setNewTag] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await problemAPI.create(formData);
      navigate('/problems');
    } catch (err: any) {
      setError(err.response?.data?.message || '创建失败');
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addTestCase = () => {
    setFormData({ ...formData, testCases: [...formData.testCases, { input: '', output: '', score: 0 }] });
  };

  const removeTestCase = (index: number) => {
    if (formData.testCases.length > 1) {
      setFormData({ ...formData, testCases: formData.testCases.filter((_, i) => i !== index) });
    }
  };

  const updateTestCase = (index: number, field: 'input' | 'output' | 'score', value: string | number) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  const addTemplateCode = () => {
    const languages = ['python', 'javascript', 'typescript', 'cpp', 'java', 'c'];
    const existingLangs = formData.templateCode.map(t => t.language);
    const nextLang = languages.find(l => !existingLangs.includes(l));
    if (nextLang) {
      setFormData({ ...formData, templateCode: [...formData.templateCode, { language: nextLang, code: '' }] });
    }
  };

  const removeTemplateCode = (index: number) => {
    if (formData.templateCode.length > 1) {
      setFormData({ ...formData, templateCode: formData.templateCode.filter((_, i) => i !== index) });
    }
  };

  const updateTemplateCode = (index: number, field: 'language' | 'code', value: string) => {
    const newTemplates = [...formData.templateCode];
    newTemplates[index][field] = value;
    setFormData({ ...formData, templateCode: newTemplates });
  };

  const generateTestCases = async () => {
    if (!formData.description) {
      setError('请先填写题目描述');
      return;
    }
    
    setGenerating(true);
    try {
      const examples = formData.testCases.filter(tc => tc.input && tc.output);
      const response = await aiAPI.generateTestCases(
        formData.description,
        formData.inputFormat,
        formData.outputFormat,
        examples,
        5
      );
      
      const newTestCases = [...formData.testCases, ...response.data.testCases];
      setFormData({ ...formData, testCases: newTestCases });
    } catch (err: any) {
      setError(err.response?.data?.message || '生成测试点失败');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>返回题库</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">创建题目</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">题目标题</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="请输入题目标题"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">题目类型</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'leetcode' | 'multifile' | 'acm' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="leetcode">LeetCode 模式</option>
                <option value="multifile">多文件模式</option>
                <option value="acm">ACM 模式</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">难度</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="easy">简单</option>
                <option value="medium">中等</option>
                <option value="hard">困难</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span key={tag} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="输入标签后按回车添加"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">题目描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={6}
                placeholder="请输入题目描述"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">输入格式</label>
              <textarea
                value={formData.inputFormat}
                onChange={(e) => setFormData({ ...formData, inputFormat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="请输入输入格式说明"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
              <textarea
                value={formData.outputFormat}
                onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="请输入输出格式说明"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">测试用例</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={generateTestCases}
                    disabled={generating}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{generating ? '生成中...' : 'AI生成'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>添加</span>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {formData.testCases.map((tc, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">测试点 {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeTestCase(index)}
                        disabled={formData.testCases.length === 1}
                        className="text-gray-400 hover:text-red-600 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">输入</label>
                        <textarea
                          value={tc.input}
                          onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          rows={2}
                          placeholder="输入内容"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">输出</label>
                        <textarea
                          value={tc.output}
                          onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          rows={2}
                          placeholder="输出内容"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">分值</label>
                        <input
                          type="number"
                          value={tc.score}
                          onChange={(e) => updateTestCase(index, 'score', Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">模板代码</label>
                <button
                  type="button"
                  onClick={addTemplateCode}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>添加语言</span>
                </button>
              </div>
              <div className="space-y-4">
                {formData.templateCode.map((template, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <select
                        value={template.language}
                        onChange={(e) => updateTemplateCode(index, 'language', e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeTemplateCode(index)}
                        disabled={formData.templateCode.length === 1}
                        className="text-gray-400 hover:text-red-600 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <textarea
                      value={template.code}
                      onChange={(e) => updateTemplateCode(index, 'code', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
                      rows={6}
                      placeholder="输入模板代码"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/problems')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                创建题目
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
