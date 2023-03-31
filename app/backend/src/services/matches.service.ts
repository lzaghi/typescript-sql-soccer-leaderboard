import * as sequelize from 'sequelize';
import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import {
  IMatch,
  IMatchesService,
  IMatchTeamsInfo,
  updateBody } from '../interfaces/IMatches';

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

  async getHomeLeaderboard(): Promise<MatchesModel[]> {
    const leaderboard = this.myModel.findAll({
      where: { inProgress: 0 },
      include: { model: this.fkModel, as: 'homeTeam', attributes: [] },
      attributes: [[sequelize.col('homeTeam.team_name'), 'name'],
        [sequelize.literal(`3 * SUM(home_team_goals > away_team_goals) +
      1 * SUM(home_team_goals = away_team_goals)`), 'totalPoints'],
        [sequelize.fn('COUNT', sequelize.col('home_team_id')), 'totalGames'],
        [sequelize.literal('SUM(home_team_goals > away_team_goals)'),
          'totalVictories'],
        [sequelize.literal('SUM(home_team_goals = away_team_goals)'),
          'totalDraws'],
        [sequelize.literal('SUM(home_team_goals < away_team_goals)'),
          'totalLosses'],
        [sequelize.fn('SUM', sequelize.col('home_team_goals')), 'goalsFavor'],
        [sequelize.fn('SUM', sequelize.col('away_team_goals')), 'goalsOwn']],
      group: ['home_team_id'],
    });
    return leaderboard;
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

  async insertMatch(body: IMatchTeamsInfo): Promise<IMatch> {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = body;
    const result = await this.myModel.create(
      { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals, inProgress: 1 },
    );
    return result;
  }
}
