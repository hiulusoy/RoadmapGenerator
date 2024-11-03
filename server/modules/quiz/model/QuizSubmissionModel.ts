import mongoose, { Document, Schema, Model } from 'mongoose';

// Quiz Submission Interface tanımı
export interface IQuizSubmission extends Document {
  quizId: mongoose.Types.ObjectId; // Hangi quiz'e ait olduğu
  userId: mongoose.Types.ObjectId; // Kullanıcının ID'si
  answers: {
    question: string;
    selectedAnswer: string;
    isCorrect: boolean;
  }[];
  correctCount: number;
  incorrectCount: number;
}

// Quiz Submission şema tanımı
const QuizSubmissionSchema: Schema = new Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [
      {
        question: { type: String, required: true },
        selectedAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],
    correctCount: { type: Number, required: true },
    incorrectCount: { type: Number, required: true },
  },
  {
    timestamps: true, // Quiz'in gönderilme ve güncellenme tarihini ekle
  }
);

// Model tanımı
const QuizSubmissionModel: Model<IQuizSubmission> = mongoose.model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema);

export default QuizSubmissionModel;
