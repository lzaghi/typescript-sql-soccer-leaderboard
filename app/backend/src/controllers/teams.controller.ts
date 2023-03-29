import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';

export default class TeamsController {
  constructor(private service: TeamsService) {}

  public async getAll(_req: Request, res: Response) {
    const teams = await this.service.getAll();
    return res.status(200).json(teams);
  }
}
