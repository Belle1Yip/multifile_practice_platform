import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface IGeneratedTestCase {
  input: string;
  output: string;
  score?: number;
}

export async function generateTestCases(
  description: string,
  inputFormat: string,
  outputFormat: string,
  examples: { input: string; output: string }[],
  count: number
): Promise<IGeneratedTestCase[]> {
  const exampleText = examples.map((ex, i) => 
    `示例 ${i + 1}:\n输入: ${ex.input}\n输出: ${ex.output}`
  ).join('\n\n');

  const prompt = `
你是一个编程题目测试用例生成专家。请根据以下题目描述生成 ${count} 个高质量的测试用例。

题目描述:
${description}

输入格式:
${inputFormat}

输出格式:
${outputFormat}

已有示例:
${exampleText}

请生成 ${count} 个新的测试用例，覆盖不同的边界情况和正常情况。每个测试用例应该包含输入和对应的输出。

输出格式要求:
每个测试用例用 JSON 对象表示，格式如下:
{"input": "输入内容", "output": "输出内容", "score": 分数}

请返回一个 JSON 数组。
  `.trim();

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: '你是一个编程题目测试用例生成专家。请严格按照要求的格式输出。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  });

  const content = response.choices[0]?.message.content || '[]';
  
  try {
    const testCases = JSON.parse(content);
    return testCases;
  } catch {
    return parseTestCasesFromText(content);
  }
}

function parseTestCasesFromText(text: string): IGeneratedTestCase[] {
  const testCases: IGeneratedTestCase[] = [];
  const lines = text.split('\n');
  
  let currentInput = '';
  let currentOutput = '';
  let inInput = false;
  let inOutput = false;

  for (const line of lines) {
    if (line.includes('输入:') || line.includes('Input:')) {
      inInput = true;
      inOutput = false;
      currentInput = line.replace(/输入:|Input:/i, '').trim();
    } else if (line.includes('输出:') || line.includes('Output:')) {
      inInput = false;
      inOutput = true;
      currentOutput = line.replace(/输出:|Output:/i, '').trim();
    } else if (inInput) {
      currentInput += '\n' + line.trim();
    } else if (inOutput) {
      currentOutput += '\n' + line.trim();
    }

    if (currentInput && currentOutput && !inInput && !inOutput) {
      testCases.push({
        input: currentInput.trim(),
        output: currentOutput.trim(),
        score: 0
      });
      currentInput = '';
      currentOutput = '';
    }
  }

  return testCases;
}