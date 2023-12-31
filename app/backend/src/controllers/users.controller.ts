import { compare } from 'bcryptjs';
import * as dotenv from 'dotenv';
import { Request, Response } from 'express';

import * as jwt from 'jsonwebtoken';
import UsersService from '../services/users.service';

dotenv.config();

export default class UsersController {
  private _secret: string;
  private _jwtConfig: object;

  constructor(private service: UsersService) {
    this._secret = process.env.JWT_SECRET || 'secret';
    this._jwtConfig = {
      expiresIn: '7d',
    };
  }

  get secret(): string {
    return this._secret;
  }

  get jwtConfig(): object {
    return this._jwtConfig;
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.service.getByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, userEmail: user.email }, this.secret, this.jwtConfig);

    compare(password, user.password, (_err, data) => {
      if (data) {
        return res.status(200).json({ token });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    });
  }

  async loginRole(req: Request, res: Response) {
    const userId = req.body.user.dataValues.id;
    const user = await this.service.getById(userId);
    if (user) return res.status(200).json({ role: user.role });
  }
}
