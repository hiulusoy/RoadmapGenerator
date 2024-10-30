import { Router } from 'express';
import UserRoutes from './modules/users/UserRoutes';
import SkillRoutes from './modules/skills/SkillRoutes';
import AuthRoutes from './modules/auth/AuthRoutes';

const router = Router();

// Ana rotaları tanımlama
router.use('/users', UserRoutes);
router.use('/skills', SkillRoutes);
router.use('/auth', AuthRoutes);

export default router;
