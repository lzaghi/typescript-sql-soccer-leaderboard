import { STRING, INTEGER, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from '.';

class TeamsModel extends Model<InferAttributes<TeamsModel>, InferCreationAttributes<TeamsModel>> {
  declare id: number;
  declare teamName: string;
}

TeamsModel.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: STRING,
    allowNull: false,
  },
}, {
  sequelize: db,
  underscored: true,
  modelName: 'teams', // recebe o nome da tabela
  timestamps: false,
});

export default TeamsModel;
