import { Router } from 'express';
import TeamsModel from '../database/models/TeamsModel';
import MatchesController from '../controllers/matches.controller';
import MatchesModel from '../database/models/MatchesModel';
import MatchesService from '../services/matches.service';

const matchesService = new MatchesService(MatchesModel, TeamsModel);
const matchesController = new MatchesController(matchesService);

const matchesRouter = Router();

matchesRouter.get('/', (req, res) => matchesController.getAll(req, res));

export default matchesRouter;
