import mongoose from 'mongoose';
import RoadmapRepository from './RoadmapRepository';
import { IRoadmapRequest } from './RoadmapRequestModel';
import axios from 'axios';
import { IRoadmapResponse, IRoadmapResponseData } from './RoadmapResponseModel';

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
      // Check if a request with the same properties already exists
      const existingRequest = await RoadmapRepository.findRequestByData(roadmapData);

      if (existingRequest) {
        // Add user ID to the array if it's not already present
        if (!existingRequest.createdByIds.includes(userId)) {
          existingRequest.createdByIds.push(userId);
          // Save the update
          await existingRequest.save();
        }

        // Optionally, return the existing roadmap if it already has a response
        const existingResponse = await RoadmapRepository.findResponseByRequestId(existingRequest._id);

        if (existingResponse) {
          return existingResponse;
        } else {
          // If no existing response, generate a new roadmap response using the Flask API
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
            weeklySchedule: responseData.weeklySchedule, // Use response data directly
            isPublic: roadmapData.isShared,
            requestId: existingRequest._id,
            createdByIds: existingRequest.createdByIds,
          };

          const savedResponse = await RoadmapRepository.createResponse(roadmapResponseData);
          return savedResponse;
        }
      } else {
        // Create a new request and response
        roadmapData.createdByIds = [userId];

        const savedRequest = await RoadmapRepository.createRequest(roadmapData);

        // Generate a new roadmap response using the Flask API
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
          weeklySchedule: responseData.weeklySchedule, // Use response data directly
          isPublic: roadmapData.isShared,
          requestId: savedRequest._id,
          createdByIds: [userId]
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
}

export default new RoadmapService();
