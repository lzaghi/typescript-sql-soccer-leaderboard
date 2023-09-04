import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { Model } from 'sequelize'
import TeamsModel from '../database/models/TeamsModel'
import { teamsList } from "./mocks/teams.mock";
import { app } from "../app"

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /teams', () => {

  it('returns status 200', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .get('/teams')
    
    expect(chaiHttpResponse.status).to.be.equal(200)
  })
})

describe('GET /teams/:id', () => {

  afterEach(sinon.restore);

  it('returns 404 when id is inexistent', async () => {
    sinon.stub(Model, 'findByPk').resolves(null);

    const chaiHttpResponse = await chai
      .request(app)
      .get('/teams/100')

    expect(chaiHttpResponse.status).to.be.equal(404)
  })

  it('returns 200 when id exists', async () => {
    sinon.stub(Model, 'findByPk').resolves(teamsList[1] as TeamsModel);

    const chaiHttpResponse = await chai
      .request(app)
      .get('/teams/100')

    expect(chaiHttpResponse.status).to.be.equal(200)
  })
})