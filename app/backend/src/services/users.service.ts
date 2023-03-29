import UsersModel from '../database/models/UsersModel';
import { IUsersService, IUserWithPassword } from '../interfaces/IUsers';

export default class UsersService implements IUsersService {
  constructor(private model: typeof UsersModel) {}

  async login(email: string): Promise<IUserWithPassword | null> {
    const user = await this.model.findOne({
      where: { email },
    });
    return user;
  }
}
