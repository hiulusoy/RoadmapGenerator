import { Router } from 'express';
import UserRoutes from './modules/users/UserRoutes';
import SkillRoutes from './modules/skills/SkillRoutes';

const router = Router();

// Ana rotaları tanımlama
router.use('/users', UserRoutes);
router.use('/skills', SkillRoutes);

export default router;
