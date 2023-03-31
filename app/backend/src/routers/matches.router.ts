import { Router } from 'express';
import TeamsModel from '../database/models/TeamsModel';
import MatchesController from '../controllers/matches.controller';
import MatchesModel from '../database/models/MatchesModel';
import MatchesService from '../services/matches.service';
import validateToken from '../middlewares/auth.middleware';
import UsersService from '../services/users.service';
import UsersModel from '../database/models/UsersModel';
import TeamsService from '../services/teams.service';

const usersService = new UsersService(UsersModel);
const teamsService = new TeamsService(TeamsModel);

const matchesService = new MatchesService(MatchesModel, TeamsModel);
const matchesController = new MatchesController(matchesService, teamsService);

const matchesRouter = Router();

matchesRouter.get('/', (req, res) => matchesController.getAll(req, res));
matchesRouter.patch(
  '/:id/finish',
  validateToken(usersService),
  (req, res) => matchesController.finishMatch(req, res),
);
matchesRouter.patch(
  '/:id',
  validateToken(usersService),
  (req, res) => matchesController.updateMatch(req, res),
);
matchesRouter.post(
  '/',
  validateToken(usersService),
  (req, res) => matchesController.insertMatch(req, res),
);

export default matchesRouter;
