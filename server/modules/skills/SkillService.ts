import SkillRepository from './skillRepository';
import { ISkill } from '../model/skillModel';

class SkillService {
  async getAll(): Promise<ISkill[]> {
    try {
      return await SkillRepository.getAll();
    } catch (error) {
      throw new Error(`Error getting skills: ${(error as Error).message}`);
    }
  }

  async getById(id: string): Promise<ISkill | null> {
    try {
      return await SkillRepository.getById(id);
    } catch (error) {
      throw new Error(`Error getting skill: ${(error as Error).message}`);
    }
  }

  async create(skillData: ISkill): Promise<ISkill> {
    try {
      return await SkillRepository.create(skillData);
    } catch (error) {
      throw new Error(`Error creating skill: ${(error as Error).message}`);
    }
  }

  async update(id: string, skillData: Partial<ISkill>): Promise<ISkill | null> {
    try {
      return await SkillRepository.update(id, skillData);
    } catch (error) {
      throw new Error(`Error updating skill: ${(error as Error).message}`);
    }
  }

  async delete(id: string): Promise<ISkill | null> {
    try {
      return await SkillRepository.delete(id);
    } catch (error) {
      throw new Error(`Error deleting skill: ${(error as Error).message}`);
    }
  }
}

export default new SkillService();
