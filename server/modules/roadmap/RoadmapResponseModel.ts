import mongoose, { Document, Schema, Model } from 'mongoose';

// Öğrenme aktivitesi arayüzü
export interface ILearningActivity {
  type: string;
  title: string;
  description: string;
  link: string;
  learningType: string;
}

// Hafta planı arayüzü
export interface IWeekPlan {
  week: number;
  title: string;
  activities: ILearningActivity[];
}

// Veritabanından alınan dökümanlar için Response arayüzü (Document genişletilmiş)
export interface IRoadmapResponse extends Document {
  _id: mongoose.Types.ObjectId;
  weeks: IWeekPlan[];
  createdByName: string;
  isPublic: boolean;
  requestId: mongoose.Types.ObjectId;
  createdByIds: mongoose.Types.ObjectId[]; // Eklendi
  createdAt: Date;
  updatedAt: Date;
}

// Yeni döküman oluşturmak için kullanılacak arayüz (Document genişletilmemiş)
export interface IRoadmapResponseData {
  weeks: IWeekPlan[];
  createdByIds: mongoose.Types.ObjectId[]; // Eklendi
  createdByName?: string;
  isPublic: boolean;
  requestId: mongoose.Types.ObjectId;
}

// Response şeması tanımı
const RoadmapResponseSchema: Schema = new Schema(
  {
    weeks: [
      {
        week: { type: Number, required: true },
        title: { type: String, required: true },
        activities: [
          {
            type: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            link: { type: String, required: true },
            learningType: { type: String, required: true },
          },
        ],
      },
    ],
    createdByIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // Eklendi
    createdByName: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapRequest', required: true },
  },
  {
    timestamps: true,
  }
);

const RoadmapResponseModel: Model<IRoadmapResponse> = mongoose.model<IRoadmapResponse>(
  'RoadmapResponse',
  RoadmapResponseSchema
);

export default RoadmapResponseModel;
