export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  age?: number;
  profession?: string;
  interests?: string[];
  skills?: string[]; // Referans olarak Skill IDs
  currentlyLearning?: string;
  wantsToLearn?: string;
  careerPlan?: string;
  role: string;
  accessToken: string;
  lastUrl: string;
}
