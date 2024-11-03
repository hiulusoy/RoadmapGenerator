import { Router } from 'express';
import QuizController from './QuizController';
import { authenticateJWT } from '../../middleware/AuthMiddleware';

const router = Router();

// Quizler için rotalar
router.post('/create-or-get', authenticateJWT, QuizController.getOrCreateQuiz); // Belirli özelliklere göre quiz getir veya yeni bir quiz oluştur
router.get('/:id', authenticateJWT, QuizController.getQuizById); // Belirli bir quiz'i ID'ye göre getir
router.post('/submit', authenticateJWT, QuizController.submitQuiz); // Belirli özelliklere göre quiz getir veya yeni bir quiz oluştur

export default router;
