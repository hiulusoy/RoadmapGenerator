import mongoose from 'mongoose';
import RoadmapRequestModel, { IRoadmapRequest } from './model/RoadmapRequestModel';
import axios from 'axios';
import RoadmapResponseModel, { IRoadmapResponse, IRoadmapResponseData } from './model/RoadmapResponseModel';
import RoadmapRepository from './RoadmapRepository';

class RoadmapService {
  async getAll(userId: string): Promise<any[]> {
    try {
      const roadmaps = await RoadmapResponseModel.find({ createdByIds: userId });

      const roadmapData = await Promise.all(
        roadmaps.map(async (roadmap) => {
          // Fetch associated request data
          const request = await RoadmapRequestModel.findById(roadmap.requestId);

          return {
            _id: roadmap._id,
            isPublic: roadmap.isPublic,
            createdByIds: roadmap.createdByIds,
            requestId: roadmap.requestId,
            weeklySchedule: {
              weeks: roadmap.weeklySchedule.weeks,
            },
            // Include additional request fields if found
            topic: request?.topic || 'Not Available',
            level: request?.level || 'Not Available',
            learning_style: request?.learning_style || 'Not Available',
          };
        })
      );

      return roadmapData;
    } catch (error) {
      throw new Error(`Error getting roadmaps: ${(error as Error).message}`);
    }
  }

  // RoadmapService.ts
  async getById(id: string): Promise<any> {
    try {
      const roadmap = await RoadmapResponseModel.findById(id).populate<{ requestId: IRoadmapRequest }>('requestId');

      if (!roadmap) return null;

      return {
        _id: roadmap._id,
        isPublic: roadmap.isPublic,
        createdByName: roadmap.createdByName,
        weeklySchedule: roadmap.weeklySchedule.weeks,
        topic: roadmap.requestId?.topic || 'N/A',
        level: roadmap.requestId?.level || 'N/A',
        learning_style: roadmap.requestId?.learning_style || 'N/A',
      };
    } catch (error) {
      throw new Error(`Error getting roadmap by ID: ${(error as Error).message}`);
    }
  }

  // Roadmap oluşturur veya günceller
  async createOrUpdate(roadmapData: IRoadmapRequest, userId: any): Promise<IRoadmapResponse> {
    try {

      // Aynı özelliklere sahip mevcut isteği bul
      const existingRequest = await RoadmapRepository.findRequestByData(roadmapData);

      if (existingRequest) {
        // Kullanıcı ID'sini ekle (eğer zaten yoksa)
        if (!existingRequest.createdByIds.includes(userId)) {
          existingRequest.createdByIds.push(userId);
          await existingRequest.save();
        }

        // Mevcut yanıtı bul
        const existingResponse = await RoadmapRepository.findResponseByRequestId(existingRequest._id);

        if (existingResponse) {
          return existingResponse;
        } else {

          // Flask API'sine istek gönder
          const flaskResponse = await axios.post('http://localhost:5001/invoke_graph', {
            topic: roadmapData.topic,
            level: roadmapData.level,
            learning_style: roadmapData.learning_style,
          });

          if (flaskResponse.status !== 200) {
            throw new Error('Error generating roadmap from Flask API');
          }

          const responseData = flaskResponse.data;

          // Yanıt verisini yapılandır
          const roadmapResponseData: IRoadmapResponseData = {
            weeklySchedule: responseData.weeklySchedule, // Flask API'den gelen veriyi doğrudan kullan
            isPublic: roadmapData.isShared,
            requestId: existingRequest._id,
            createdByIds: existingRequest.createdByIds,
          };


          // Yanıtı kaydet
          const savedResponse = await RoadmapRepository.createResponse(roadmapResponseData);
          return savedResponse;
        }
      } else {

        // Yeni istek oluştur
        roadmapData.createdByIds = [userId];

        const savedRequest = await RoadmapRepository.createRequest(roadmapData);

        // Flask API'sine istek gönder
        const flaskResponse = await axios.post('http://localhost:5001/invoke_graph', {
          topic: roadmapData.topic,
          level: roadmapData.level,
          learning_style: roadmapData.learning_style,
        });

        if (flaskResponse.status !== 200) {
          throw new Error('Error generating roadmap from Flask API');
        }

        const responseData = flaskResponse.data;

        // Yanıt verisini yapılandır
        const roadmapResponseData: IRoadmapResponseData = {
          weeklySchedule: responseData.weeklySchedule, // Flask API'den gelen veriyi doğrudan kullan
          isPublic: roadmapData.isShared,
          requestId: savedRequest._id,
          createdByIds: [userId],
        };


        // Yanıtı kaydet
        const savedResponse = await RoadmapRepository.createResponse(roadmapResponseData);
        return savedResponse;
      }
    } catch (error) {
      console.error('Error creating or updating roadmap:', error);
      throw new Error(`Error creating or updating roadmap: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<IRoadmapResponse | null> {
    try {
      return await RoadmapRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting roadmap: ${(error as Error).message}`);
    }
  }
}

export default new RoadmapService();
