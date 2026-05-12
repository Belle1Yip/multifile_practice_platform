import { Code2, BookOpen, FileText, Brain, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const features = [
    {
      icon: Code2,
      title: '多模式判题',
      description: '支持 LeetCode 模式、多文件模式、ACM 模式，满足不同编程场景需求',
      color: 'blue'
    },
    {
      icon: Brain,
      title: 'AI 测试点生成',
      description: '内置 AI 大模型，自动根据题目描述和样例生成高质量测试用例',
      color: 'purple'
    },
    {
      icon: FileText,
      title: '智能组卷',
      description: '自定义组卷功能，支持从题库中灵活选题，设置考试时间和判题模式',
      color: 'green'
    },
    {
      icon: BookOpen,
      title: '题库导入',
      description: '支持从主流 OJ 平台导入题目，也可通过 PDF 等文档批量上传',
      color: 'orange'
    }
  ];

  const colorMap = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-6">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            编程学习在线评测平台
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            支持多种编程竞赛模式，内置 AI 测试点生成，轻松创建和管理题库，助力编程学习和竞赛训练
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/problems"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              开始刷题
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/exams"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              创建试卷
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">核心功能</h2>
          <p className="text-gray-600">全方位满足编程学习和竞赛训练需求</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[feature.color as keyof typeof colorMap]} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">支持多种判题模式</h2>
            <p className="text-blue-100 mb-8">灵活选择 ACM 模式或 OI 模式，满足不同评分需求</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">ACM 模式</h3>
                <p className="text-blue-100 text-sm">答案完全正确得满分，错误得 0 分</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2">OI 模式</h3>
                <p className="text-blue-100 text-sm">按测试点得分累加，部分正确部分得分</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
