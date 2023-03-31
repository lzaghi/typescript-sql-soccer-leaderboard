export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserWithoutPassword extends IUserLogin {
  id: number;
  role: string;
}

export interface IUserWithPassword extends IUserWithoutPassword {
  password: string;
  dataValues: IUserWithPassword
}
export interface IDataValues {
  dataValues: IUserWithPassword
}

export interface IUsersService {
  getByEmail(email: string): Promise<IUserWithPassword | null>
  getById(id: number): Promise<IDataValues | null>;
}
