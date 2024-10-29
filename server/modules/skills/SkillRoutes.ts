import { Router } from 'express';
import SkillController from './SkillController';

const router = Router();

// Skill için rotalar
router.get('/', SkillController.getAll); // Tüm skills getir
router.get('/:id', SkillController.getById); // Belirli bir skill'i getir
router.post('/', SkillController.createSkill); // Yeni bir skill oluştur
router.put('/:id', SkillController.updateSkill); // Belirli bir skill'i güncelle
router.delete('/:id', SkillController.deleteSkill); // Belirli bir skill'i sil

export default router;
