import { Request, Response } from 'express';
import { IMatchesService } from '../interfaces/IMatches';

export default class MatchesController {
  constructor(private service: IMatchesService) {}

  async getAll(_req: Request, res: Response) {
    const matches = await this.service.getAll();
    return res.status(200).json(matches);
  }
}
