import { Router } from 'express';
import TeamsModel from '../database/models/TeamsModel';
import MatchesController from '../controllers/matches.controller';
import MatchesModel from '../database/models/MatchesModel';
import MatchesService from '../services/matches.service';
import validateToken from '../middlewares/auth.middleware';
import UsersService from '../services/users.service';
import UsersModel from '../database/models/UsersModel';

const usersService = new UsersService(UsersModel);

const matchesService = new MatchesService(MatchesModel, TeamsModel);
const matchesController = new MatchesController(matchesService, usersService);

const matchesRouter = Router();

matchesRouter.get('/', (req, res) => matchesController.getAll(req, res));
matchesRouter.patch(
  '/:id/finish',
  validateToken,
  (req, res) => matchesController.finishMatch(req, res),
);

export default matchesRouter;
