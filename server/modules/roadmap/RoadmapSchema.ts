import mongoose, { Schema } from 'mongoose';

// Şema tanımı
const RoadmapSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, min: 0, required: true },
    profession: { type: String, required: true },
    interests: { type: [String], default: [] },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill', // Skill modeline referans
      },
    ],
    currentlyLearning: { type: String, default: '' },
    wantsToLearn: { type: String, default: '' },
    careerPlan: { type: String, default: '' },
  },
  {
    timestamps: true, // Oluşturulma ve güncellenme tarihlerini otomatik olarak ekler
  }
);

export default RoadmapSchema;
