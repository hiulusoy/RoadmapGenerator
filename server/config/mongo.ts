import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // .env dosyasını yükle

// MONGODB URI'yi environment değişkenlerinden alıyoruz
const MONGODB_URI = process.env.MONGODB_URI as string;

const connectDB = async (): Promise<void> => {
  if (!MONGODB_URI) {
    console.error('MongoDB URI tanımlı değil! Lütfen .env dosyasını kontrol edin.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI); // Seçenekleri kaldırdık
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

export default connectDB;
