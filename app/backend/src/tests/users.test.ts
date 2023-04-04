import * as sinon from 'sinon';
import * as chai from 'chai';

// @ts-ignore
import chaiHttp = require('chai-http');

import { Model } from 'sequelize'
import UsersModel from '../database/models/UsersModel'
import { app } from "../app"

// import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {

  // let chaiHttpResponse: Response;
  afterEach(sinon.restore);

  describe('Missing or invalid login fields', () => {
    it('returns status 400 when email is missing', async () => {
      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          password: '123456'
        })
      
      expect(chaiHttpResponse.status).to.be.equal(400)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' })
    })

    it('returns status 400 when password is missing', async () => {
      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'test@mail.com'
        })
      
      expect(chaiHttpResponse.status).to.be.equal(400)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' })
    })

    it('returns status 401 when email is invalid', async () => {
      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'mail.com',
          password: '123456'
        })
      
      expect(chaiHttpResponse.status).to.be.equal(401)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Invalid email or password' })
    })

    it('returns status 401 when password is invalid', async () => {
      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'test@mail.com',
          password: '1234'
        })
      
      expect(chaiHttpResponse.status).to.be.equal(401)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Invalid email or password' })
    })

    it('returns status 401 when email is not registered', async () => {
      sinon.stub(Model, 'findOne').resolves(null);
      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'test@mail.com',
          password: '123456'
        })
      
      expect(chaiHttpResponse.status).to.be.equal(401)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Invalid email or password' })
    })

    it('returns status 401 when password is wrong', async () => {
      const user = {
        id: 1,
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
      }

      sinon.stub(Model, 'findOne').resolves(user as UsersModel);
      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'xablau'
        })
      
      expect(chaiHttpResponse.status).to.be.equal(401)
    })
  })

  describe('Valid login fields', () => {
    it('returns status 200 and a token', async () => {
      const user = {
        id: 1,
        email: 'admin@admin.com',
        password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
      }

      sinon.stub(Model, 'findOne').resolves(user as UsersModel);
      const chaiHttpResponse = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin'
        })
      
      expect(chaiHttpResponse.status).to.be.equal(200)
    })
  })
})

describe('POST /login/role', () => {
  afterEach(sinon.restore);

  describe('Missing or invalid token', () => {
    it('returns status 401 when token is missing', async () => {
      const chaiHttpResponse = await chai
        .request(app)
        .get('/login/role')
        .set({})
      
      expect(chaiHttpResponse.status).to.be.equal(401)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token not found' })
    })

    it('returns status 401 when token is invalid', async () => {
      const chaiHttpResponse = await chai
        .request(app)
        .get('/login/role')
        .set('authorization', 'invalid')
      
      expect(chaiHttpResponse.status).to.be.equal(401)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token must be a valid token' })
    })

    it('returns status 401 when token is invalid', async () => {
      const authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY4MDY0MTkzMCwiZXhwIjoxNjgxMjQ2NzMwfQ.zEM8z1BCx2lk0MAVdTdbjK5sitSheMGcorv4FXAASws'

      sinon.stub(Model, 'findByPk').resolves(null);
      const chaiHttpResponse = await chai
        .request(app)
        .get('/login/role')
        .set('authorization', authorization)
      
      expect(chaiHttpResponse.status).to.be.equal(401)
      expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token must be a valid token' })
    })
  })

  // describe('Valid token', () => {
  //   it('returns status 200 and a token', async () => {
  //     const authorization = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY4MDY0MTkzMCwiZXhwIjoxNjgxMjQ2NzMwfQ.zEM8z1BCx2lk0MAVdTdbjK5sitSheMGcorv4FXAASws'

  //     const user = {
  //       id: 1,
  //       email: 'admin@admin.com',
  //       password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
  //     }

  //     sinon.stub(Model, 'findByPk').resolves(user as UsersModel);
  //     const chaiHttpResponse = await chai
  //       .request(app)
  //       .get('/login/role')
  //       .set('authorization', authorization)
      
  //     expect(chaiHttpResponse.status).to.be.equal(200)
  //   })
  // })
})