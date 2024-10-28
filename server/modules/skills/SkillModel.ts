import mongoose, { Document, Model } from 'mongoose';
import SkillSchema from './SkillSchema';

// Skill arayüzü tanımı (TypeScript için)
export interface ISkill extends Document {
  technology: string;
  level: number; // 1'den 5'e kadar bir seviye
}

// Model tanımı
const SkillModel: Model<ISkill> = mongoose.model<ISkill>('Skill', SkillSchema);

export default SkillModel;
