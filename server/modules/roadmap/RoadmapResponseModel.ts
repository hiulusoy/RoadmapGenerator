import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for individual learning resources within each activity
export interface ILearningResource {
  description: string;
  learningType: string[];
  link: string;
}

// Interface for activities within each week
export interface IActivity {
  activity: string;
  description: string;
  learningType: string[];
  resources: ILearningResource[];
}

// Interface for each week within the roadmap
export interface IWeekSchedule {
  week: string;
  details: IActivity;
}

// Roadmap response interface extending Document (for database documents)
export interface IRoadmapResponse extends Document {
  _id: mongoose.Types.ObjectId;
  weeklySchedule: { weeks: Record<string, IWeekSchedule> };
  createdByName: string;
  isPublic: boolean;
  requestId: mongoose.Types.ObjectId;
  createdByIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  // Method to return weeks in a consistent structure
  getWeeks(): Record<string, IWeekSchedule>;
}

// Interface for creating new roadmap data (without Document extension)
export interface IRoadmapResponseData {
  weeklySchedule: { weeks: Record<string, IWeekSchedule> };
  createdByIds: mongoose.Types.ObjectId[];
  createdByName?: string;
  isPublic: boolean;
  requestId: mongoose.Types.ObjectId;
}

// Roadmap schema definition
const RoadmapResponseSchema: Schema = new Schema(
  {
    weeklySchedule: {
      weeks: {
        type: Map,
        of: new Schema({
          week: { type: String, required: true },
          details: {
            activity: { type: String, required: true },
            description: { type: String, required: true },
            learningType: [{ type: String, required: true }],
            resources: [
              {
                description: { type: String, required: true },
                learningType: [{ type: String, required: true }],
                link: { type: String, required: true },
              },
            ],
          },
        }),
        required: true,
      },
    },
    createdByIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    createdByName: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoadmapRequest', required: true }, // corrected reference
  },
  {
    timestamps: true,
  }
);

// Custom method to get weeks in the desired format
RoadmapResponseSchema.methods.getWeeks = function (): Record<string, IWeekSchedule> {
  return this.weeklySchedule.weeks.toJSON();
};

// Model definition
const RoadmapResponseModel: Model<IRoadmapResponse> = mongoose.model<IRoadmapResponse>('RoadmapResponse', RoadmapResponseSchema);

export default RoadmapResponseModel;
