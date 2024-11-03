import { Request, Response } from 'express';
import RoadmapService from './RoadmapService';
import { sendResponse, sendErrorResponse } from '../../utils/ControllerUtil';
import { IRoadmapRequest } from './RoadmapRequestModel';

class RoadmapController {
  // Tüm roadmapi getirir
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        sendErrorResponse(res, 'Unauthorized', 401);
        return;
      }

      const roadmaps = await RoadmapService.getAll(userId);
      sendResponse(res, roadmaps);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 500);
    }
  };

  // ID'ye göre roadmap getirir
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const roadmap = await RoadmapService.getById(id);
      if (!roadmap) {
        sendErrorResponse(res, 'Roadmap not found', 404);
        return;
      }
      sendResponse(res, roadmap);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 500);
    }
  };

  // Yeni bir roadmap oluşturur veya mevcut olana kullanıcı ekler
  createRoadmap = async (req: Request, res: Response): Promise<void> => {
    try {
      const roadmapData = req.body;
      const userId = req.userId;

      if (!userId) {
        sendErrorResponse(res, 'Unauthorized', 401);
        return;
      }

      const roadmap = await RoadmapService.createOrUpdate(roadmapData, userId);
      sendResponse(res, roadmap, 201);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };

  // Roadmap siler
  deleteRoadmap = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const result = await RoadmapService.delete(id);
      if (!result) {
        sendErrorResponse(res, 'Roadmap not found', 404);
        return;
      }
      sendResponse(res, { message: 'Roadmap deleted' });
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 500);
    }
  };
}

export default new RoadmapController();
