export interface ITeam {
  teamName: string;
}

export interface ITeamWithId extends ITeam {
  id: number;
}

export interface ITeamService {
  getAll(): Promise<ITeamWithId[]>;
  getById(id: number): Promise<ITeamWithId | null>;
}
