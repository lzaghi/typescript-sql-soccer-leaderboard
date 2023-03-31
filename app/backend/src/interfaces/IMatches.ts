export interface IMatchTeamsInfo {
  homeTeamId: number,
  homeTeamGoals: number,
  awayTeamId: number,
  awayTeamGoals: number,
}

export interface IMatch extends IMatchTeamsInfo {
  id: number,
  inProgress: boolean,
}

export interface IMatchAssociation extends IMatch {
  homeTeam: {
    teamName: string
  }
  awayTeam: {
    teamName: string
  }
}

export type updateBody = {
  homeTeamGoals: string,
  awayTeamGoals: string
};

export interface ILeaderboard {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
}

export interface IMatchesService {
  getByQuery(q: string): Promise<IMatch[]>
  getAll(): Promise<IMatch[]>
  getHomeLeaderboard(): Promise<object[]>
  finishMatch(id: number): Promise<void>
  updateMatch(id: number, updateBody: updateBody): Promise<void>
  insertMatch(body: IMatchTeamsInfo): Promise<IMatch>
}
