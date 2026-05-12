import { exec, ExecOptions } from 'child_process';
import { promisify } from 'util';
import { ITestCase } from '../models/Problem';

const execPromise = promisify(exec);

export interface ITestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  score: number;
  time: number;
  memory: number;
}

export async function executeCode(code: string, language: string, testCases: ITestCase[], judgeMode: string): Promise<ITestResult[]> {
  const results: ITestResult[] = [];

  for (const testCase of testCases) {
    const result = await runTestCase(code, language, testCase);
    results.push(result);
  }

  if (judgeMode === 'oi') {
    const totalScore = testCases.reduce((sum, tc) => sum + (tc.score || 100 / testCases.length), 0);
    results.forEach((result, index) => {
      result.score = result.passed ? (testCases[index].score || totalScore / testCases.length) : 0;
    });
  }

  return results;
}

async function runTestCase(code: string, language: string, testCase: ITestCase): Promise<ITestResult> {
  const startTime = Date.now();
  
  let actualOutput = '';
  let passed = false;
  let time = 0;
  let memory = 0;

  try {
    const { stdout, stderr, time: execTime } = await executeCodeWithInput(code, language, testCase.input);
    
    actualOutput = stdout.trim();
    time = execTime || (Date.now() - startTime);
    passed = actualOutput === testCase.output.trim();
  } catch (error: any) {
    actualOutput = error.message || error.stderr || 'Runtime error';
  }

  return {
    input: testCase.input,
    expectedOutput: testCase.output,
    actualOutput,
    passed,
    score: passed ? (testCase.score || 0) : 0,
    time,
    memory
  };
}

async function executeCodeWithInput(code: string, language: string, input: string): Promise<{ stdout: string; stderr: string; time?: number }> {
  const options: ExecOptions = {
    timeout: 5000,
    maxBuffer: 1024 * 1024
  };

  switch (language) {
    case 'python':
      return await execPromise(`python -c "${escapeShell(code)}"`, {
        ...options,
        input
      });
    case 'javascript':
      return await execPromise(`node -e "${escapeShell(code)}"`, {
        ...options,
        input
      });
    case 'typescript':
      return await execPromise(`npx ts-node -e "${escapeShell(code)}"`, {
        ...options,
        input
      });
    case 'java':
      const javaCode = code;
      return await execPromise(`echo '${escapeShell(javaCode)}' | javac - && java Main`, {
        ...options,
        input
      });
    case 'cpp':
      return await execPromise(`echo '${escapeShell(code)}' | g++ -x c++ - && ./a.out`, {
        ...options,
        input
      });
    case 'c':
      return await execPromise(`echo '${escapeShell(code)}' | gcc -x c - && ./a.out`, {
        ...options,
        input
      });
    default:
      throw new Error(`不支持的语言: ${language}`);
  }
}

function escapeShell(str: string): string {
  return str.replace(/(["'\\])/g, '\\$1').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}