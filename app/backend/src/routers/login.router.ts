import { Router } from 'express';
import validateLoginBody from '../middlewares/validateLoginBody.middleware';
import UsersController from '../controllers/users.controller';
import UsersModel from '../database/models/UsersModel';
import UsersService from '../services/users.service';
import validateToken from '../middlewares/auth.middleware';

const usersService = new UsersService(UsersModel);
const usersController = new UsersController(usersService);

const loginRouter = Router();

loginRouter.post('/', validateLoginBody, (req, res) => usersController.login(req, res));
loginRouter.get('/role', validateToken, (req, res) => usersController.loginRole(req, res));

export default loginRouter;
