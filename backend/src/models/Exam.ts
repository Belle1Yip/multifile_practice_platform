import mongoose, { Document, Schema } from 'mongoose';

export interface IExamProblem {
  problemId: mongoose.Types.ObjectId;
  score: number;
  order: number;
}

export interface IExam extends Document {
  title: string;
  description: string;
  problems: IExamProblem[];
  startTime: Date;
  endTime: Date;
  judgeMode: 'acm' | 'oi';
  createdAt: Date;
  updatedAt: Date;
}

const ExamProblemSchema: Schema = new Schema({
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  order: {
    type: Number,
    required: true
  }
});

const ExamSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  problems: {
    type: [ExamProblemSchema],
    default: []
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  judgeMode: {
    type: String,
    enum: ['acm', 'oi'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IExam>('Exam', ExamSchema);