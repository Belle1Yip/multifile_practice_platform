import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { generateTestCases } from '../services/aiService';

const router = express.Router();

router.post('/generate-testcases', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { description, inputFormat, outputFormat, examples = [], count = 5 } = req.body;

    const testCases = await generateTestCases(description, inputFormat, outputFormat, examples, count);

    res.json({ testCases });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || '生成测试点失败' });
  }
});

export default router;