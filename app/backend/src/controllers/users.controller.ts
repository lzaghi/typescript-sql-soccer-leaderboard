import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import UsersService from '../services/users.service';

const secret = process.env.JWT_SECRET || 'secret';
const jwtConfig = {
  expiresIn: '7d',
};

export default class UsersController {
  constructor(private service: UsersService) {}

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await this.service.getByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = sign({ data: { userId: user.id } }, secret, jwtConfig);

    compare(password, user.password, (_err, data) => {
      if (data) {
        return res.status(200).json({ token });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    });
  }
}
