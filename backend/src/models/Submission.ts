import mongoose, { Document, Schema } from 'mongoose';

export interface ITestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  score: number;
  time: number;
  memory: number;
}

export interface ISubmission extends Document {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'time_limit' | 'memory_limit' | 'runtime_error' | 'compile_error';
  score: number;
  judgeMode: 'acm' | 'oi';
  testResults: ITestResult[];
  createdAt: Date;
}

const TestResultSchema: Schema = new Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  actualOutput: { type: String, required: true },
  passed: { type: Boolean, required: true },
  score: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
  memory: { type: Number, default: 0 }
});

const SubmissionSchema: Schema = new Schema({
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong_answer', 'time_limit', 'memory_limit', 'runtime_error', 'compile_error'],
    default: 'pending'
  },
  score: {
    type: Number,
    default: 0
  },
  judgeMode: {
    type: String,
    enum: ['acm', 'oi'],
    required: true
  },
  testResults: {
    type: [TestResultSchema],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);