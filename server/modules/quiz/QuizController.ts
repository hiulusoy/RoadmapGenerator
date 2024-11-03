import { Request, Response } from 'express';
import QuizService from './QuizService';
import { sendResponse, sendErrorResponse } from '../../utils/ControllerUtil';
import QuizSubmissionModel from './model/QuizSubmissionModel';

class QuizController {
  // Belirli özelliklere göre quiz getirir veya yeni bir quiz oluşturur
  getOrCreateQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
      const { description, learningType, level } = req.body;

      if (!description || !learningType || !level) {
        sendErrorResponse(res, 'Eksik veri sağlandı. description, learningType ve level gereklidir.', 400);
        return;
      }

      // Veritabanında mevcut quiz'i kontrol et veya yenisini oluştur
      let quiz = await QuizService.createOrSaveQuiz(description, learningType, level);
      sendResponse(res, quiz);
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(res, error.message, 500);
      } else {
        sendErrorResponse(res, 'Bilinmeyen bir hata oluştu', 500);
      }
    }
  };

  // ID'ye göre quiz getirir
  getQuizById = async (req: Request, res: Response): Promise<void> => {
    try {
      const quizId = req.params.id;
      const quiz = await QuizService.getQuizById(quizId);

      if (!quiz) {
        sendErrorResponse(res, 'Quiz bulunamadı', 404);
        return;
      }

      sendResponse(res, quiz);
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(res, error.message, 500);
      } else {
        sendErrorResponse(res, 'Bilinmeyen bir hata oluştu', 500);
      }
    }
  };

  // Quiz gönderimini işleme alır
  submitQuiz = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quizId, userAnswers } = req.body;
      const userId = req.userId; // Kullanıcı kimliği, middleware ile doğrulanmış olmalıdır.

      if (!quizId || !userAnswers) {
        sendErrorResponse(res, 'Eksik veri sağlandı. quizId ve userAnswers gereklidir.', 400);
        return;
      }

      // Quiz gönderimini işleyip kaydet
      const submission = await QuizService.submitQuiz(quizId, userId, userAnswers);
      sendResponse(res, submission, 201);
    } catch (error) {
      if (error instanceof Error) {
        sendErrorResponse(res, error.message, 500);
      } else {
        sendErrorResponse(res, 'Bilinmeyen bir hata oluştu', 500);
      }
    }
  };
}

export default new QuizController();
