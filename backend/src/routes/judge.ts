import express from 'express';
import Problem from '../models/Problem';
import Submission from '../models/Submission';
import { authMiddleware } from '../middleware/auth';
import { executeCode } from '../services/judgeService';

const router = express.Router();

router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { problemId, code, language, judgeMode = 'acm' } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: '题目不存在' });
    }

    const submission = new Submission({
      problemId,
      userId: req.user!.id,
      code,
      language,
      judgeMode,
      status: 'pending'
    });
    await submission.save();

    const testResults = await executeCode(code, language, problem.testCases, judgeMode);
    
    let score = 0;
    let status = 'accepted';
    
    if (judgeMode === 'acm') {
      const allPassed = testResults.every(result => result.passed);
      score = allPassed ? 100 : 0;
      status = allPassed ? 'accepted' : 'wrong_answer';
    } else {
      score = testResults.reduce((sum, result) => sum + result.score, 0);
      const maxScore = problem.testCases.reduce((sum, tc) => sum + (tc.score || 100 / problem.testCases.length), 0);
      if (score < maxScore) status = 'wrong_answer';
    }

    submission.status = status;
    submission.score = score;
    submission.testResults = testResults;
    await submission.save();

    res.json(submission);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || '服务器错误' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problemId')
      .populate('userId');
    
    if (!submission) {
      return res.status(404).json({ message: '提交记录不存在' });
    }
    
    res.json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/submissions', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, problemId } = req.query;
    const query: any = { userId: req.user!.id };
    
    if (problemId) query.problemId = problemId;

    const submissions = await Submission.find(query)
      .populate('problemId')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Submission.countDocuments(query);

    res.json({ submissions, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;