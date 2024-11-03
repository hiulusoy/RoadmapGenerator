import mongoose from 'mongoose';
import RoadmapRepository from './RoadmapRepository';
import { IRoadmapRequest } from './RoadmapRequestModel';
import { IRoadmapResponse, IRoadmapResponseData, IWeekPlan, ILearningActivity } from './RoadmapResponseModel';
import axios from 'axios';

class RoadmapService {
  async getAll(userId: string): Promise<IRoadmapResponse[]> {
    try {
      return await RoadmapRepository.getAll(userId);
    } catch (error) {
      throw new Error(`Error getting roadmaps: ${(error as Error).message}`);
    }
  }

  async getById(id: string): Promise<IRoadmapResponse | null> {
    try {
      return await RoadmapRepository.getById(id);
    } catch (error) {
      throw new Error(`Error getting roadmap: ${(error as Error).message}`);
    }
  }

  async createOrUpdate(roadmapData: IRoadmapRequest, userId: any): Promise<IRoadmapResponse> {
    try {
      // Aynı özelliklere sahip bir request var mı kontrol edelim
      const existingRequest = await RoadmapRepository.findRequestByData(roadmapData);

      if (existingRequest) {
        // Kullanıcı ID'si zaten mevcut değilse dizilere ekleyelim
        if (!existingRequest.createdByIds.includes(userId)) {
          existingRequest.createdByIds.push(userId);

          // Güncellemeyi kaydedelim
          await existingRequest.save();
        }
        // İsteğe bağlı: Mevcut request'e karşılık gelen roadmap'i döndürebilirsiniz
        const existingResponse = await RoadmapRepository.findResponseByRequestId(existingRequest._id);

        if (existingResponse) {
          return existingResponse;
        } else {
          // Eğer mevcut response yoksa yeni response oluşturabilirsiniz
          // Flask API çağrısı ve response oluşturma işlemleri
          const flaskResponse = await axios.post('http://localhost:5001/invoke_graph', {
            topic: roadmapData.topic,
            level: roadmapData.level,
            learning_style: roadmapData.learning_style,
          });

          if (flaskResponse.status !== 200) {
            throw new Error('Error generating roadmap from Flask API');
          }

          const responseData = flaskResponse.data;

          const roadmapResponseData: IRoadmapResponseData = {
            weeks: this.parseResponseToWeeks(responseData.response),
            isPublic: roadmapData.isShared,
            requestId: existingRequest._id,
            createdByIds: existingRequest.createdByIds,
            // Diğer alanlar
          };

          const savedResponse = await RoadmapRepository.createResponse(roadmapResponseData);

          return savedResponse;
        }
      } else {
        // Yeni bir request ve response oluşturuyoruz
        roadmapData.createdByIds = [userId];

        const savedRequest = await RoadmapRepository.createRequest(roadmapData);

        // Flask API çağrısı ve response oluşturma işlemleri
        const flaskResponse = await axios.post('http://localhost:5001/invoke_graph', {
          topic: roadmapData.topic,
          level: roadmapData.level,
          learning_style: roadmapData.learning_style,
        });

        if (flaskResponse.status !== 200) {
          throw new Error('Error generating roadmap from Flask API');
        }

        const responseData = flaskResponse.data;

        const roadmapResponseData: IRoadmapResponseData = {
          weeks: this.parseResponseToWeeks(responseData.response),
          isPublic: roadmapData.isShared,
          requestId: savedRequest._id,
          createdByIds: [userId],
          // Diğer alanlar
        };

        const savedResponse = await RoadmapRepository.createResponse(roadmapResponseData);

        return savedResponse;
      }
    } catch (error) {
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

  // Flask API'den gelen yanıtı weeks yapısına dönüştürür
  private parseResponseToWeeks(response: string): IWeekPlan[] {
    const weeks: IWeekPlan[] = [];

    // Yanıt metnindeki kaçış karakterlerini temizleyelim
    const cleanedResponse = response.replace(/\\\\/g, '\\').replace(/\\n/g, '\n');

    // Satırlara bölelim
    const lines = cleanedResponse.split('\n');

    let currentWeek: IWeekPlan | null = null;

    for (let line of lines) {
      line = line.trim();

      // Yeni bir hafta başlıyor
      if (line.startsWith('**Week')) {
        // Önceki haftayı weeks dizisine ekleyelim
        if (currentWeek) {
          weeks.push(currentWeek);
        }

        // Haftanın başlığını alalım
        const weekTitleMatch = line.match(/\*\*(Week \d+.*)\*\*/);
        if (weekTitleMatch) {
          currentWeek = {
            week: weeks.length + 1,
            title: weekTitleMatch[1],
            activities: [],
          };
        }
      }
      // Aktivite satırı
      else if (line.startsWith('* **') && currentWeek) {
        // Aktivitenin tipini ve başlığını alalım
        const activityMatch = line.match(/\*\*(.*?)\*\*:\s*(.*?)(?:\s*-\s*(.*?))?\s*(?:\[(.*?)\]\((.*?)\))?\s*(?:\(Learning Type:\s*(.*?)\))?/);

        if (activityMatch) {
          const activityType = activityMatch[1] || '';
          const activityTitle = activityMatch[2] || '';
          const activityDescription = activityMatch[3] || '';
          const linkText = activityMatch[4] || '';
          const linkUrl = activityMatch[5] || '';
          const learningType = activityMatch[6] || '';

          const activity: ILearningActivity = {
            type: activityType.trim(),
            title: activityTitle.trim(),
            description: activityDescription.trim(),
            link: linkUrl.trim(),
            learningType: learningType.trim(),
          };

          currentWeek.activities.push(activity);
        }
      }
    }

    // Son haftayı da weeks dizisine ekleyelim
    if (currentWeek) {
      weeks.push(currentWeek);
    }

    return weeks;
  }
}

export default new RoadmapService();
