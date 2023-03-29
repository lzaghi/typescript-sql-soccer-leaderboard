import TeamsModel from '../database/models/TeamsModel';
import { ITeamService, ITeamWithId } from '../interfaces/ITeams';

export default class TeamsService implements ITeamService {
  constructor(private model: typeof TeamsModel) {}

  async getAll(): Promise<ITeamWithId[]> {
    const teams = await this.model.findAll();
    return teams;
  }

  async getById(id: number): Promise<ITeamWithId | null> {
    const team = await this.model.findByPk(id);
    return team;
  }
}
