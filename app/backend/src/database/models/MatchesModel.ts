import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import TeamsModel from './TeamsModel';

class MatchesModel extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

MatchesModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  homeTeamId: {
    type: INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  underscored: true,
  modelName: 'matches', // recebe o nome da tabela
  timestamps: false,
});

export default MatchesModel;

TeamsModel.hasMany(MatchesModel, { sourceKey: 'id', foreignKey: 'homeTeamId' });
TeamsModel.hasMany(MatchesModel, { sourceKey: 'id', foreignKey: 'awayTeamId' });

MatchesModel.belongsTo(TeamsModel, { foreignKey: 'homeTeamId', targetKey: 'id', as: 'homeTeam' });
MatchesModel.belongsTo(TeamsModel, { foreignKey: 'homeTeamId', targetKey: 'id' });
MatchesModel.belongsTo(TeamsModel, { foreignKey: 'awayTeamId', targetKey: 'id', as: 'awayTeam' });
