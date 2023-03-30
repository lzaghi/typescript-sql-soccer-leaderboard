import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import { IMatch, IMatchesService } from '../interfaces/IMatches';

export default class MatchesService implements IMatchesService {
  constructor(
    private myModel: typeof MatchesModel,
    private fkModel: typeof TeamsModel,
  ) {}

  async getAll(): Promise<IMatch[]> {
    const matches = await this.myModel.findAll({
      include: [
        { model: this.fkModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: this.fkModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  }
}
