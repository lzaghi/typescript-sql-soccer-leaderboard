import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import { IMatch, IMatchesService, IMatchTeamsInfo, updateBody } from '../interfaces/IMatches';

export default class MatchesService implements IMatchesService {
  private _bool: number;
  constructor(
    private myModel: typeof MatchesModel,
    private fkModel: typeof TeamsModel,
  ) {
    this._bool = 1;
  }

  async getByQuery(q: string): Promise<IMatch[]> {
    this._bool = q === 'true' ? 1 : 0;
    const matches = await this.myModel.findAll({
      where: { inProgress: this._bool },
      include: [
        { model: this.fkModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: this.fkModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  }

  async getAll(): Promise<IMatch[]> {
    const matches = await this.myModel.findAll({
      include: [
        { model: this.fkModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: this.fkModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  }

  async finishMatch(id: number): Promise<void> {
    await this.myModel.update(
      { inProgress: 0 },
      { where: { id } },
    );
  }

  async updateMatch(id: number, body: updateBody): Promise<void> {
    const { homeTeamGoals, awayTeamGoals } = body;
    await this.myModel.update(
      { homeTeamGoals, awayTeamGoals },
      { where: { id } },
    );
  }

  async insertMatch(body: IMatchTeamsInfo): Promise<any> {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = body;
    const result = await this.myModel.create(
      { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress: 1 },
    );
    return result;
  }
}
