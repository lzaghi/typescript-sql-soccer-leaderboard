import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

import * as jwt from 'jsonwebtoken';
import { ITeamService } from '../interfaces/ITeams';
import { IUsersService } from '../interfaces/IUsers';
import { IMatchesService } from '../interfaces/IMatches';

dotenv.config();

interface JwtPayload {
  data: {
    userId: number,
  }
}

export default class MatchesController {
  private _secret: string;
  private _tokenMessage: string;

  constructor(
    private service: IMatchesService,
    private usersService: IUsersService,
    private teamsService: ITeamService,
  ) {
    this._secret = process.env.JWT_SECRET || 'secret';
    this._tokenMessage = 'Token must be a valid token';
  }

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
    const { authorization: token } = req.headers;

    try {
      const payload = jwt.verify(token as string, this._secret) as JwtPayload;
      const { data: { userId } } = payload;
      const user = await this.usersService.getById(userId);

      if (!user) {
        return res.status(401).json({ message: this._tokenMessage });
      }

      req.body.user = user;
      await this.service.finishMatch(+id);
      return res.status(200).json({ message: 'Finished' });
    } catch (error) {
      return res.status(401).json({ message: this._tokenMessage });
    }
  }

  async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { authorization: token } = req.headers;

    try {
      const payload = jwt.verify(token as string, this._secret) as JwtPayload;
      const { data: { userId } } = payload;
      const user = await this.usersService.getById(userId);

      if (!user) {
        return res.status(401).json({ message: this._tokenMessage });
      }

      req.body.user = user;
      await this.service.updateMatch(+id, req.body);
      return res.status(200).json({ message: 'Match updated' });
    } catch (error) {
      return res.status(401).json({ message: this._tokenMessage });
    }
  }

  async insertMatch(req: Request, res: Response) {
    const { authorization: token } = req.headers;
    const { homeTeamId, awayTeamId } = req.body;

    try {
      const payload = jwt.verify(token as string, this._secret) as JwtPayload;
      const user = await this.usersService.getById(payload.data.userId);

      if (!user) return res.status(401).json({ message: this._tokenMessage });

      if (homeTeamId === awayTeamId) {
        return res.status(422)
          .json({ message: 'It is not possible to create a match with two equal teams' });
      }

      const t1 = await this.teamsService.getById(homeTeamId);
      const t2 = await this.teamsService.getById(awayTeamId);

      if (!t1 || !t2) return res.status(404).json({ message: 'There is no team with such id!' });

      const newMatch = await this.service.insertMatch(req.body);
      return res.status(201).json(newMatch);
    } catch (error) {
      return res.status(401).json({ message: this._tokenMessage });
    }
  }
}
