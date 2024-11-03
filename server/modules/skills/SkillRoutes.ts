import { Router } from 'express';
import SkillController from './SkillController';
import { authenticateJWT } from '../../middleware/AuthMiddleware';

const router = Router();

// Skill için rotalar
router.get('/', authenticateJWT, SkillController.getAll); // Tüm skills getir
router.get('/:id', authenticateJWT, SkillController.getById); // Belirli bir skill'i getir
router.post('/', authenticateJWT, SkillController.createSkill); // Yeni bir skill oluştur
router.put('/:id', authenticateJWT, SkillController.updateSkill); // Belirli bir skill'i güncelle
router.delete('/:id', authenticateJWT, SkillController.deleteSkill); // Belirli bir skill'i sil

export default router;
