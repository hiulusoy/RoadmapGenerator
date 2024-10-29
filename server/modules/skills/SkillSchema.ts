import mongoose, { Schema } from 'mongoose';

// Şema tanımı
const SkillSchema: Schema = new Schema(
  {
    technology: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 5 }, // Seviye 1'den 5'e kadar olabilir
  },
  {
    timestamps: true, // Oluşturulma ve güncellenme tarihlerini otomatik olarak ekler
  }
);

export default SkillSchema;
