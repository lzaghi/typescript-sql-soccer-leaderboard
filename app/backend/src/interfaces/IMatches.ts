export interface IMatch {
  id: number,
  homeTeamId: number,
  homeTeamGoals: number,
  awayTeamId: number,
  awayTeamGoals: number,
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

export interface IMatchesService {
  getAll(): Promise<IMatch[]>
  getByQuery(q: string): Promise<IMatch[]>
  finishMatch(id: number): Promise<void>
  updateMatch(id: number, updateBody: updateBody): Promise<void>
}
