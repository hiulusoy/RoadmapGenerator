import SkillModel, { ISkill } from './SkillModel';

class SkillRepository {
  async getAll(): Promise<ISkill[]> {
    try {
      return await SkillModel.find();
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<ISkill | null> {
    try {
      return await SkillModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async create(skillData: ISkill): Promise<ISkill> {
    try {
      const skill = new SkillModel(skillData);
      return await skill.save();
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, skillData: Partial<ISkill>): Promise<ISkill | null> {
    try {
      return await SkillModel.findByIdAndUpdate(id, skillData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<ISkill | null> {
    try {
      return await SkillModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

export default new SkillRepository();
