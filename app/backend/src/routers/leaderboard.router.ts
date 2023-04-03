import { Router } from 'express';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import MatchesService from '../services/matches.service';
import MatchesController from '../controllers/matches.controller';
import TeamsService from '../services/teams.service';

const teamsService = new TeamsService(TeamsModel);

const matchesService = new MatchesService(MatchesModel, TeamsModel);
const matchesController = new MatchesController(matchesService, teamsService);

const leaderboardRouter = Router();

leaderboardRouter.get('/home', (req, res) => matchesController.getHomeLeaderboard(req, res));
leaderboardRouter.get('/away', (req, res) => matchesController.getAwayLeaderboard(req, res));
leaderboardRouter.get('/', (req, res) => matchesController.getGeneralLeaderboard(req, res));

export default leaderboardRouter;
