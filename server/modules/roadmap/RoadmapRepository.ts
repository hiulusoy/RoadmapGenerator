import mongoose from 'mongoose';
import RoadmapRequestModel, { IRoadmapRequest } from './RoadmapRequestModel';
import RoadmapResponseModel, { IRoadmapResponse, IRoadmapResponseData } from './RoadmapResponseModel';

class RoadmapRepository {
  // Tüm roadmapi getirir
  async getAll(userId: string): Promise<IRoadmapResponse[]> {
    try {
      return await RoadmapResponseModel.find({ createdByIds: userId });
    } catch (error) {
      throw error;
    }
  }

  // ID'ye göre roadmap getirir
  async getById(id: string): Promise<IRoadmapResponse | null> {
    try {
      return await RoadmapResponseModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Yeni roadmap yanıtı oluşturur
  async createResponse(roadmapResponseData: IRoadmapResponseData): Promise<IRoadmapResponse> {
    try {
      const roadmapResponse = new RoadmapResponseModel(roadmapResponseData);
      return await roadmapResponse.save();
    } catch (error) {
      throw error;
    }
  }

  // Roadmap yanıtını siler
  async delete(id: string): Promise<IRoadmapResponse | null> {
    try {
      return await RoadmapResponseModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  // Aynı özelliklere sahip RoadmapRequest'i bulur
  async findRequestByData(roadmapData: IRoadmapRequest): Promise<IRoadmapRequest | null> {
    try {
      return await RoadmapRequestModel.findOne({
        topic: roadmapData.topic,
        level: roadmapData.level,
        learning_style: roadmapData.learning_style
      });
    } catch (error) {
      throw error;
    }
  }

  // Request ID'ye göre RoadmapResponse'u bulur
  async findResponseByRequestId(requestId: mongoose.Types.ObjectId): Promise<IRoadmapResponse | null> {
    try {
      return await RoadmapResponseModel.findOne({ requestId });
    } catch (error) {
      throw error;
    }
  }

  // Yeni roadmap isteği oluşturur
  async createRequest(roadmapRequestData: IRoadmapRequest): Promise<IRoadmapRequest> {
    try {
      const roadmapRequest = new RoadmapRequestModel(roadmapRequestData);
      return await roadmapRequest.save();
    } catch (error) {
      throw error;
    }
  }
}

export default new RoadmapRepository();
