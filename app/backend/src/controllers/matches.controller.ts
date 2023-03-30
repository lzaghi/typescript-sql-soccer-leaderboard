import { Request, Response } from 'express';
import { IMatchesService } from '../interfaces/IMatches';

export default class MatchesController {
  constructor(private service: IMatchesService) {}

  async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;

    if (inProgress) {
      const matches = await this.service.getByQuery(inProgress as string);
      return res.status(200).json(matches);
    }

    const matches = await this.service.getAll();
    return res.status(200).json(matches);
  }
}
