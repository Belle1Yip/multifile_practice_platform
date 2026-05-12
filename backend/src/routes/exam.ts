import express from 'express';
import { check, validationResult } from 'express-validator';
import Exam from '../models/Exam';
import Problem from '../models/Problem';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const exams = await Exam.find()
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Exam.countDocuments();

    res.json({ exams, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('problems.problemId');
    if (!exam) {
      return res.status(404).json({ message: '试卷不存在' });
    }
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', authMiddleware, adminMiddleware, [
  check('title', '标题不能为空').notEmpty(),
  check('startTime', '开始时间不能为空').notEmpty(),
  check('endTime', '结束时间不能为空').notEmpty(),
  check('judgeMode', '判题模式必须是 acm 或 oi').isIn(['acm', 'oi'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) {
      return res.status(404).json({ message: '试卷不存在' });
    }
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: '试卷不存在' });
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/:id/add-problem', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { problemId, score, order } = req.body;
    
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: '题目不存在' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: '试卷不存在' });
    }

    exam.problems.push({ problemId, score, order });
    await exam.save();

    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;