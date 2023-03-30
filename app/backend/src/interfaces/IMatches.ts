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

export interface IMatchesService {
  getAll(): Promise<IMatch[]>
  getByQuery(q: string): Promise<IMatch[]>
}
