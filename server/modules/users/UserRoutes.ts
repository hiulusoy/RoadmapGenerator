import { Router } from 'express';
import UserController from './UserController';

const router = Router();

// Kullanıcılar için rotalar
router.get('/', UserController.getAll); // Tüm kullanıcıları getir
router.get('/:id', UserController.getById); // Belirli bir kullanıcıyı getir
router.post('/', UserController.createUser); // Yeni bir kullanıcı oluştur
router.put('/:id', UserController.updateUser); // Belirli bir kullanıcıyı güncelle
router.delete('/:id', UserController.deleteUser); // Belirli bir kullanıcıyı sil

export default router;
