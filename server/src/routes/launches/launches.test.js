const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: '9TH N 101',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1410 b',
      launchDate: 'May 29, 2030',
    };

    const launchDataWithoutDate = {
      mission: '9TH N 101',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1410 b',
    };

    const launchDataWithInvalidDate = {
      mission: '9TH N 101',
      rocket: 'NCC 1701-D',
      target: 'Kepler-1410 b',
      launchDate: 'foo',
    };

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .expect('Content-Type', /json/)
        .send(completeLaunchData)
        .expect(201);

      //Checking date seperately cause we changed its Format in our code.
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      //checking POST request returns the created launch data.
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });

    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
