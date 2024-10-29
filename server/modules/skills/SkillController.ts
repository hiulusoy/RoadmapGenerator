import { Request, Response } from 'express';
import SkillService from './SkillService';
import { sendResponse, sendErrorResponse } from '../../utils/ControllerUtil';

class SkillController {
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const skills = await SkillService.getAll();
      sendResponse(res, skills);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 500);
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const skill = await SkillService.getById(id);
      if (!skill) {
        sendErrorResponse(res, 'Skill not found', 404);
        return;
      }
      sendResponse(res, skill);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 404);
    }
  };

  createSkill = async (req: Request, res: Response): Promise<void> => {
    try {
      const skillData = req.body;
      const skill = await SkillService.create(skillData);
      sendResponse(res, skill, 201);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };

  updateSkill = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const skillData = req.body;
      const skill = await SkillService.update(id, skillData);
      if (!skill) {
        sendErrorResponse(res, 'Skill not found', 404);
        return;
      }
      sendResponse(res, skill);
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 400);
    }
  };

  deleteSkill = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const result = await SkillService.delete(id);
      if (!result) {
        sendErrorResponse(res, 'Skill not found', 404);
        return;
      }
      sendResponse(res, { message: 'Skill deleted' });
    } catch (error) {
      sendErrorResponse(res, (error as Error).message, 500);
    }
  };
}

export default new SkillController();
