import express from 'express';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import Problem from '../models/Problem';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/oj', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { url } = req.body;

    let problemData: any = {};

    if (url.includes('leetcode.com')) {
      problemData = await parseLeetCodeProblem(url);
    } else if (url.includes('codeforces.com')) {
      problemData = await parseCodeforcesProblem(url);
    } else {
      return res.status(400).json({ message: '暂不支持该OJ平台' });
    }

    const problem = new Problem(problemData);
    await problem.save();

    res.json({ message: '导入成功', problem });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || '导入失败' });
  }
});

router.post('/pdf', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { pdfBase64 } = req.body;

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const data = await pdfParse(pdfBuffer);

    const problems = parseProblemsFromPDF(data.text);
    
    const savedProblems = [];
    for (const problemData of problems) {
      const problem = new Problem(problemData);
      await problem.save();
      savedProblems.push(problem);
    }

    res.json({ message: `成功导入 ${savedProblems.length} 道题目`, problems: savedProblems });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'PDF解析失败' });
  }
});

async function parseLeetCodeProblem(url: string): Promise<any> {
  const response = await axios.get(url);
  const html = response.data;

  const titleMatch = html.match(/<title>(.+?) - LeetCode<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'Untitled';

  return {
    title,
    description: '从LeetCode导入',
    difficulty: 'medium',
    type: 'leetcode',
    tags: ['leetcode'],
    inputFormat: '',
    outputFormat: '',
    testCases: [],
    templateCode: []
  };
}

async function parseCodeforcesProblem(url: string): Promise<any> {
  const response = await axios.get(url);
  const html = response.data;

  const titleMatch = html.match(/<div class="title">(.*?)<\/div>/);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  return {
    title,
    description: '从Codeforces导入',
    difficulty: 'medium',
    type: 'acm',
    tags: ['codeforces'],
    inputFormat: '',
    outputFormat: '',
    testCases: [],
    templateCode: []
  };
}

function parseProblemsFromPDF(text: string): any[] {
  const problems: any[] = [];
  const problemBlocks = text.split(/\n\n+/);
  
  problemBlocks.forEach((block, index) => {
    if (block.length > 100) {
      problems.push({
        title: `题目 ${index + 1}`,
        description: block,
        difficulty: 'medium',
        type: 'acm',
        tags: ['pdf'],
        inputFormat: '',
        outputFormat: '',
        testCases: [],
        templateCode: []
      });
    }
  });

  return problems;
}

export default router;