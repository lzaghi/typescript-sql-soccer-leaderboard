import * as express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger/swagger.json';
import loginRouter from './routers/login.router';
import matchesRouter from './routers/matches.router';
import teamsRouter from './routers/teams.router';
import leaderboardRouter from './routers/leaderboard.router';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.app.use('/teams', teamsRouter);
    this.app.use('/login', loginRouter);
    this.app.use('/matches', matchesRouter);
    this.app.use('/leaderboard', leaderboardRouter);

    // Não remover essa rota
    this.app.get('/', (_req, res) => res.json({ ok: true }));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
