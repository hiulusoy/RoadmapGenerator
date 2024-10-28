// AuthService.ts
import bcrypt from 'bcryptjs';
import AuthModel, { IAuth } from '../auth/AuthModel';
import UserModel from '../users/UserModel';
import { generateToken } from '../../utils/JwtUtils';

class AuthService {
  // AuthService.ts içindeki register fonksiyonu
  async register(email: string, password: string, userData: any): Promise<IAuth> {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştururken role bilgisi ekleniyor
    const user = new UserModel(userData);
    const savedUser = await user.save();

    const auth = new AuthModel({
      email,
      password: hashedPassword,
      user: savedUser._id,
    });

    const savedAuth = await auth.save();
    savedAuth.password = undefined; // Şifre alanını kaldırıyoruz

    return savedAuth;
  }

  // Kullanıcı giriş işlemi
  async login(email: string, password: string): Promise<{ auth: IAuth; token: string }> {
    const auth = await AuthModel.findOne({ email }).select('+password').populate('user').exec();

    if (!auth || !auth.password) {
      throw new Error('Kullanıcı bulunamadı veya şifre eksik');
    }

    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      throw new Error('Geçersiz şifre');
    }

    // Şifre alanını kaldırıyoruz
    auth.password = undefined;

    const token = generateToken(auth.user._id.toString());
    return { auth, token };
  }
}

export default new AuthService();
