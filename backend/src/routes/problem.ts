import express from 'express';
import { check, validationResult } from 'express-validator';
import Problem from '../models/Problem';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, type, tag } = req.query;
    const query: any = {};
    
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (tag) query.tags = tag;

    const problems = await Problem.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Problem.countDocuments(query);

    res.json({ problems, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: '题目不存在' });
    }
    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.post('/', authMiddleware, adminMiddleware, [
  check('title', '标题不能为空').notEmpty(),
  check('description', '描述不能为空').notEmpty(),
  check('difficulty', '难度必须是 easy, medium 或 hard').isIn(['easy', 'medium', 'hard']),
  check('type', '类型必须是 leetcode, multifile 或 acm').isIn(['leetcode', 'multifile', 'acm'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!problem) {
      return res.status(404).json({ message: '题目不存在' });
    }
    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: '题目不存在' });
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router;