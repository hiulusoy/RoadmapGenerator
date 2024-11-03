import mongoose, { Document, Schema, Model } from 'mongoose';

// Quiz Interface tanımı
export interface IQuiz extends Document {
  description: string;
  learningType: string[];
  level: string;
  questions: {
    question: string;
    options: string[]; // Options alanı 'answers' yerine 'options' olarak adlandırıldı
    correctAnswer: string;
  }[];
}

// Quiz şema tanımı
const QuizSchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    learningType: [{ type: String, required: true }],
    level: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }], // Burada 'options' kullanılıyor
        correctAnswer: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true, // Quiz'in oluşturulma ve güncellenme tarihini ekle
  }
);

// Model tanımı
const QuizModel: Model<IQuiz> = mongoose.model<IQuiz>('Quiz', QuizSchema);

export default QuizModel;
