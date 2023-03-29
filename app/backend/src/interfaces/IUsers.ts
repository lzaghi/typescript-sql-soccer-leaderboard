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
}

export interface IUsersService {
  login(email: string): Promise<IUserWithPassword | null>
}
