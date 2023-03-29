import { Router } from 'express';
import TeamsController from '../controllers/teams.controller';
import TeamsService from '../services/teams.service';
import TeamsModel from '../database/models/TeamsModel';

const teamsService = new TeamsService(TeamsModel);
const teamsController = new TeamsController(teamsService);

const teamsRouter = Router();

teamsRouter.get('/', (req, res) => teamsController.getAll(req, res));
teamsRouter.get('/:id', (req, res) => teamsController.getById(req, res));

export default teamsRouter;
