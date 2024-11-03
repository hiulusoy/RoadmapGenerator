import QuizModel, { IQuiz } from './model/QuizModel';

class QuizRepository {
  // Quiz'in mevcut olup olmadığını kontrol et (description, learningType ve level bazında)
  async findQuiz(description: string, learningType: string[], level: string): Promise<IQuiz | null> {
    try {
      return await QuizModel.findOne({ description, learningType, level });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Quiz arama hatası: ${error.message}`);
      }
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }

  // Yeni quiz oluştur ve veritabanına kaydet
  async createQuiz(quizData: IQuiz): Promise<IQuiz> {
    try {
      const quiz = new QuizModel(quizData);
      return await quiz.save();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Quiz oluşturma hatası: ${error.message}`);
      }
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }

  // ID'ye göre quiz getir
  async findQuizById(quizId: string): Promise<IQuiz | null> {
    try {
      return await QuizModel.findById(quizId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Quiz ID ile arama hatası: ${error.message}`);
      }
      throw new Error('Bilinmeyen bir hata oluştu');
    }
  }
}

export default new QuizRepository();
