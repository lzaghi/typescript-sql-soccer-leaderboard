import * as sequelize from 'sequelize';
import TeamsModel from '../database/models/TeamsModel';
import MatchesModel from '../database/models/MatchesModel';
import {
  ILeaderboard,
  IMatch,
  IMatchesService,
  IMatchTeamsInfo,
  updateBody,
} from '../interfaces/IMatches';

export default class MatchesService implements IMatchesService {
  private _bool: number;

  constructor(
    private myModel: sequelize.ModelStatic<MatchesModel>,
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
    return this.myModel.findAll({ where: { inProgress: 0 },
      include: [{ model: this.fkModel, as: 'homeTeam', attributes: [] },
        { model: this.fkModel, as: 'awayTeam', attributes: [] }],
      attributes: [[sequelize.col('homeTeam.team_name'), 'name'],
        [sequelize.literal(`3 * SUM(home_team_goals > away_team_goals) +
          1 * SUM(home_team_goals = away_team_goals)`), 'totalPoints'],
        [sequelize.fn('COUNT', sequelize.col('home_team_id')), 'totalGames'],
        [sequelize.literal('SUM(home_team_goals > away_team_goals)'), 'totalVictories'],
        [sequelize.literal('SUM(home_team_goals = away_team_goals)'), 'totalDraws'],
        [sequelize.literal('SUM(home_team_goals < away_team_goals)'), 'totalLosses'],
        [sequelize.fn('SUM', sequelize.col('home_team_goals')), 'goalsFavor'],
        [sequelize.fn('SUM', sequelize.col('away_team_goals')), 'goalsOwn'],
        [sequelize.literal('SUM(home_team_goals) - SUM(away_team_goals)'), 'goalsBalance'],
        [sequelize.literal(`ROUND(((3 * SUM(home_team_goals > away_team_goals) + 1 * SUM(
          home_team_goals=away_team_goals))/(COUNT(home_team_id) * 3)) * 100, 2)`), 'efficiency']],
      group: ['home_team_id'],
      order: [['totalPoints', 'DESC'], ['totalVictories', 'DESC'],
        ['goalsBalance', 'DESC'], ['goalsFavor', 'DESC']] });
  }

  async getAwayLeaderboard(): Promise<MatchesModel[]> {
    return this.myModel.findAll({
      where: { inProgress: 0 },
      include: { model: this.fkModel, as: 'awayTeam', attributes: [] },
      attributes: [[sequelize.col('awayTeam.team_name'), 'name'],
        [sequelize.literal(`3 * SUM(away_team_goals > home_team_goals) +
          1 * SUM(away_team_goals = home_team_goals)`), 'totalPoints'],
        [sequelize.fn('COUNT', sequelize.col('away_team_id')), 'totalGames'],
        [sequelize.literal('SUM(away_team_goals > home_team_goals)'), 'totalVictories'],
        [sequelize.literal('SUM(away_team_goals = home_team_goals)'), 'totalDraws'],
        [sequelize.literal('SUM(away_team_goals < home_team_goals)'), 'totalLosses'],
        [sequelize.fn('SUM', sequelize.col('away_team_goals')), 'goalsFavor'],
        [sequelize.fn('SUM', sequelize.col('home_team_goals')), 'goalsOwn'],
        [sequelize.literal('SUM(away_team_goals) - SUM(home_team_goals)'), 'goalsBalance'],
        [sequelize.literal(`ROUND(((3 * SUM(away_team_goals > home_team_goals) + 1 * SUM(
          away_team_goals=home_team_goals))/(COUNT(away_team_id) * 3)) * 100, 2)`), 'efficiency']],
      group: ['away_team_id'],
      order: [['totalPoints', 'DESC'], ['totalVictories', 'DESC'],
        ['goalsBalance', 'DESC'], ['goalsFavor', 'DESC']] });
  }

  static handleLeaderboardSort(leaderboardArray: ILeaderboard[]) {
    return leaderboardArray.sort((a, b) => {
      if (a.totalPoints !== b.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (a.totalVictories !== b.totalVictories) {
        return b.totalVictories - a.totalVictories;
      }
      if (a.goalsBalance !== b.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      return b.goalsFavor - a.goalsFavor;
    });
  }

  static compileTeamsInfo(homeTeams: MatchesModel[], awayTeams: MatchesModel[]) {
    const generalLeaderboard = homeTeams.map((hTeam) => {
      const gTeam = hTeam.dataValues;
      awayTeams.forEach((aTeam) => {
        if (aTeam.dataValues.name === hTeam.dataValues.name) {
          gTeam.totalGames = +gTeam.totalGames + +aTeam.dataValues.totalGames;
          gTeam.totalVictories = +gTeam.totalVictories + +aTeam.dataValues.totalVictories;
          gTeam.totalDraws = +gTeam.totalDraws + +aTeam.dataValues.totalDraws;
          gTeam.totalLosses = +gTeam.totalLosses + +aTeam.dataValues.totalLosses;
          gTeam.goalsFavor = +gTeam.goalsFavor + +aTeam.dataValues.goalsFavor;
          gTeam.goalsOwn = +gTeam.goalsOwn + +aTeam.dataValues.goalsOwn;
          gTeam.goalsBalance = gTeam.goalsFavor - gTeam.goalsOwn;
          gTeam.totalPoints = gTeam.totalVictories * 3 + gTeam.totalDraws * 1;
          gTeam.efficiency = ((gTeam.totalPoints / (gTeam.totalGames * 3)) * 100).toFixed(2);
        }
      });
      return gTeam;
    });

    return MatchesService.handleLeaderboardSort(generalLeaderboard);
  }

  async getGeneralLeaderboard(): Promise<ILeaderboard[]> {
    const homeArr = await this.getHomeLeaderboard();
    const awayArr = await this.getAwayLeaderboard();

    return MatchesService.compileTeamsInfo(homeArr, awayArr);
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
