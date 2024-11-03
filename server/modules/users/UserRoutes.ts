import { Router } from 'express';
import UserController from './UserController';
import { authenticateJWT } from '../../middleware/AuthMiddleware';

const router = Router();

// Kullanıcılar için rotalar
router.get('/', authenticateJWT, UserController.getAll); // Tüm kullanıcıları getir
router.get('/:id', authenticateJWT, UserController.getById); // Belirli bir kullanıcıyı getir
router.post('/', authenticateJWT, UserController.createUser); // Yeni bir kullanıcı oluştur
router.put('/:id', authenticateJWT, UserController.updateUser); // Belirli bir kullanıcıyı güncelle
router.delete('/:id', authenticateJWT, UserController.deleteUser); // Belirli bir kullanıcıyı sil

export default router;
