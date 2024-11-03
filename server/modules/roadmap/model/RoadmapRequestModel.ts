import mongoose, { Document, Schema, Model } from 'mongoose';

// Öğrenme planı arayüz tanımı (TypeScript için)
export interface IRoadmapRequest extends Document {
  _id: mongoose.Types.ObjectId;
  topic: string;
  level: string;
  learning_style: string;
  createdByIds: mongoose.Types.ObjectId[]; // Artık isteğe bağlı değil
  createdByNames: string[]; // Artık isteğe bağlı değil
  isShared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Öğrenme planı şeması
const RoadmapRequestSchema: Schema = new Schema(
  {
    topic: { type: String, required: true },
    level: { type: String, required: true },
    learning_style: { type: String, required: true },
    createdByIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [], // Varsayılan değer
    },
    createdByNames: {
      type: [String],
      default: [], // Varsayılan değer
    },
    isShared: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Model tanımı
const RoadmapRequestModel: Model<IRoadmapRequest> = mongoose.model<IRoadmapRequest>('RoadmapRequest', RoadmapRequestSchema);

export default RoadmapRequestModel;
