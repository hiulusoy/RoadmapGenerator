import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthModel from '../modules/auth/AuthModel';

const JWT_SECRET = process.env.JWT_SECRET || 'sizin-gizli-anahtarınız';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  auth?: any;
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      // JWT token'ını doğruluyoruz
      const decodedToken: any = jwt.verify(token, JWT_SECRET);

      // decodedToken içinden userId bilgisini alıyoruz
      const userId = decodedToken.userId;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
        return;
      }

      // Kullanıcı bilgilerini alıyoruz
      const authData = await AuthModel.findOne({ user: userId }).populate('user');

      if (!authData) {
        res.status(401).json({ message: 'Unauthorized: User not found' });
        return;
      }

      // Kullanıcı kimliğini request nesnesine ekliyoruz
      req.userId = userId;
      req.auth = authData;
      next();
    } catch (error) {
      res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
};
