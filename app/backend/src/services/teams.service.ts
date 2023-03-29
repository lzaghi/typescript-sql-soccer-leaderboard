import TeamsModel from '../database/models/TeamsModel';
import { ITeamService, ITeamWithId } from '../interfaces/ITeams';

export default class TeamsService implements ITeamService {
  constructor(private model: typeof TeamsModel) {}

  public async getAll(): Promise<ITeamWithId[]> {
    const teams = await this.model.findAll();
    return teams;
  }
}
