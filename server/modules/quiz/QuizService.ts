import QuizRepository from './QuizRepository';
import { IQuiz } from './model/QuizModel';
import axios from 'axios';
import QuizSubmissionModel from './model/QuizSubmissionModel';

class QuizService {
  // Veritabanında quiz var mı kontrol et
  async getQuiz(description: string, learningType: string[], level: string): Promise<IQuiz | null> {
    try {
      return await QuizRepository.findQuiz(description, learningType, level);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Quiz getirme hatası: ${error.message}`);
      }
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }

  // Yeni quiz oluştur ya da veritabanına kaydet
  async createOrSaveQuiz(description: string, learningType: string[], level: string): Promise<IQuiz> {
    try {
      // Öncelikle veritabanında quiz var mı kontrol ediyoruz.
      let existingQuiz = await this.getQuiz(description, learningType, level);
      if (existingQuiz) {
        return existingQuiz; // Eğer quiz varsa onu döndürüyoruz.
      }

      // Eğer quiz yoksa yeni bir quiz oluşturmak için Flask API'sine istek yapıyoruz.
      const flaskResponse = await axios.post('http://localhost:5001/create_quiz', {
        description,
        learningType,
        level,
      });

      if (flaskResponse.status !== 200) {
        throw new Error('Flask API kullanılarak quiz oluşturulamadı.');
      }

      // Flask API'den dönen soruları alıyoruz.
      const questions = flaskResponse.data.questions;
      if (!questions || questions.length === 0) {
        throw new Error('Quiz oluşturma sırasında yeterli veri alınamadı.');
      }

      // Her sorunun seçeneklerinin eksiksiz olup olmadığını kontrol et.
      questions.forEach((question: any) => {
        if (!question.options || question.options.length !== 4) {
          throw new Error('Her soru için 4 adet seçenek (option) gereklidir.');
        }
      });

      // Yeni oluşturulan quiz'i veritabanına kaydediyoruz.
      const quizData: Partial<IQuiz> = {
        description,
        learningType,
        level,
        questions,
      };

      const savedQuiz = await QuizRepository.createQuiz(quizData as IQuiz);

      return savedQuiz;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Quiz kaydetme hatası: ${error.message}`);
      }
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }

  // ID'ye göre quiz getir
  async getQuizById(quizId: string): Promise<IQuiz | null> {
    try {
      return await QuizRepository.findQuizById(quizId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Quiz ID ile getirme hatası: ${error.message}`);
      }
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }

  // Quiz gönderimini işle ve kaydet
  async submitQuiz(quizId: string, userId: any, userAnswers: string[]): Promise<any> {
    try {
      const quiz = await this.getQuizById(quizId);
      if (!quiz) {
        throw new Error('Quiz bulunamadı');
      }

      let correctCount = 0;
      let incorrectCount = 0;

      // Yanıtları değerlendir ve doğru/yanlış sayısını hesapla
      const answers = quiz.questions.map((question, index) => {
        const selectedAnswer = userAnswers[index];
        const isCorrect = selectedAnswer === question.correctAnswer;

        if (isCorrect) {
          correctCount++;
        } else {
          incorrectCount++;
        }

        return {
          question: question.question,
          selectedAnswer,
          correctAnswer: question.correctAnswer, // Doğru cevabı ekliyoruz
          isCorrect,
        };
      });

      // Quiz gönderimini kaydet
      const submissionData = {
        quizId,
        userId,
        answers,
        correctCount,
        incorrectCount,
      };

      const submission = new QuizSubmissionModel(submissionData);
      return await submission.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Quiz gönderim işlemi sırasında hata oluştu: ${error.message}`);
      }
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }
}

export default new QuizService();
