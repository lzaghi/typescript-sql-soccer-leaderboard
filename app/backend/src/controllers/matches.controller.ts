import { Request, Response } from 'express';

import { ITeamService } from '../interfaces/ITeams';
import { IMatchesService } from '../interfaces/IMatches';

export default class MatchesController {
  constructor(
    private service: IMatchesService,
    private teamsService: ITeamService,
  ) {}

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress) {
      const matches = await this.service.getByQuery(inProgress as string);
      return res.status(200).json(matches);
    }

    const matches = await this.service.getAll();
    return res.status(200).json(matches);
  }

  async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    await this.service.finishMatch(+id);
    return res.status(200).json({ message: 'Finished' });
  }

  async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    await this.service.updateMatch(+id, req.body);
    return res.status(200).json({ message: 'Match updated' });
  }

  async insertMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId } = req.body;
    if (homeTeamId === awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    const t1 = await this.teamsService.getById(homeTeamId);
    const t2 = await this.teamsService.getById(awayTeamId);

    if (!t1 || !t2) return res.status(404).json({ message: 'There is no team with such id!' });

    const newMatch = await this.service.insertMatch(req.body);
    return res.status(201).json(newMatch);
  }
}
