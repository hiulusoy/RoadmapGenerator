import { Router } from 'express';
import UserRoutes from './modules/users/UserRoutes';
import SkillRoutes from './modules/skills/SkillRoutes';
import AuthRoutes from './modules/auth/AuthRoutes';
import RoadmapRoutes from './modules/roadmap/RoadmapRoutes';
import QuizRoutes from './modules/quiz/QuizRoutes';

const router = Router();

// Ana rotaları tanımlama
router.use('/users', UserRoutes);
router.use('/skills', SkillRoutes);
router.use('/auth', AuthRoutes);
router.use('/roadmap', RoadmapRoutes);
router.use('/quiz', QuizRoutes);

export default router;
