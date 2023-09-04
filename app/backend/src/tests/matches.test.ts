import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from "../app"

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /leaderboard', () => {
  it('/leaderboard/home returns status 200', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/home')
    
    expect(chaiHttpResponse.status).to.be.equal(200)
  })

  it('/leaderboard/away returns status 200', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard/away')
    
    expect(chaiHttpResponse.status).to.be.equal(200)
  })

  it('/leaderboard returns status 200', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .get('/leaderboard')
    
    expect(chaiHttpResponse.status).to.be.equal(200)
  })
})

describe('GET /matches', () => {
  it('/matches returns status 200', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .get('/matches')
    
    expect(chaiHttpResponse.status).to.be.equal(200)
  })

  it('/matches?inProgress=true returns status 200', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=true')
    
    expect(chaiHttpResponse.status).to.be.equal(200)
  })

  it('/matches?inProgress=true returns status 200', async () => {
    const chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=false')
    
    expect(chaiHttpResponse.status).to.be.equal(200)
  })
})

describe('PATCH /matches/:id', () => {
  
})

