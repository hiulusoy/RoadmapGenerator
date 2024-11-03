import { Router } from 'express';
import RoadmapController from './RoadmapController';
import { authenticateJWT } from '../../middleware/AuthMiddleware';

const router = Router();

// Roadmaplar için rotalar
router.get('/', authenticateJWT, RoadmapController.getAll); // Tüm roadmapları getir
router.get('/:id', authenticateJWT, RoadmapController.getById); // Belirli bir roadmapyı getir
router.post('/', authenticateJWT, RoadmapController.createRoadmap); // Yeni bir roadmap oluştur
router.delete('/:id', authenticateJWT, RoadmapController.deleteRoadmap); // Belirli bir roadmapyı sil

export default router;
