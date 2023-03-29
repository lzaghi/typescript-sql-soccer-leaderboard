import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';

export default class TeamsController {
  constructor(private service: TeamsService) {}

  async getAll(_req: Request, res: Response) {
    const teams = await this.service.getAll();
    return res.status(200).json(teams);
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await this.service.getById(+id);

    if (!team) {
      return res.status(404).json({ message: 'id not found' });
    }

    return res.status(200).json(team);
  }
}
