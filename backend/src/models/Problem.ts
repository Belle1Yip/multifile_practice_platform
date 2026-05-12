import mongoose, { Document, Schema } from 'mongoose';

export interface ITestCase {
  input: string;
  output: string;
  score?: number;
}

export interface ITemplateCode {
  language: string;
  code: string;
}

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'leetcode' | 'multifile' | 'acm';
  tags: string[];
  inputFormat: string;
  outputFormat: string;
  testCases: ITestCase[];
  templateCode: ITemplateCode[];
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSchema: Schema = new Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  score: { type: Number, default: 0 }
});

const TemplateCodeSchema: Schema = new Schema({
  language: { type: String, required: true },
  code: { type: String, required: true }
});

const ProblemSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  type: {
    type: String,
    enum: ['leetcode', 'multifile', 'acm'],
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  inputFormat: {
    type: String,
    default: ''
  },
  outputFormat: {
    type: String,
    default: ''
  },
  testCases: {
    type: [TestCaseSchema],
    default: []
  },
  templateCode: {
    type: [TemplateCodeSchema],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model<IProblem>('Problem', ProblemSchema);