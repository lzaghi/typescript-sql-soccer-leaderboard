import * as dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';

import * as jwt from 'jsonwebtoken';
import UsersService from '../services/users.service';

dotenv.config();

interface JwtPayload {
  userId: number,
}

const validateToken = (usersService: UsersService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization: token } = req.headers;
    const secret = process.env.JWT_SECRET || 'secret';

    if (!token) return res.status(401).json({ message: 'Token not found' });

    try {
      const payload = jwt.verify(token as string, secret) as JwtPayload;
      const { userId } = payload;
      const user = await usersService.getById(userId);

      if (!user) {
        return res.status(401).json({ message: 'Token must be a valid token' });
      }
      req.body.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  };

export default validateToken;
