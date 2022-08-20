import supertest from 'supertest';
import { UserService } from '../services/user.services';
import app from '../app';

const user = new UserService();
const request = supertest(app);
let token: string;

beforeAll(async () => {
  const result = await request
    .post('/api/users/login')
    .send({
      name: 'lululu',
      password: '123456'
    })
    .set('Accept', 'application/json');
  token = result.body.token;
  console.log('token:::' + token);
});

describe('Tests create User endpoints exist', () => {
  it('checks createUser method exists', () => {
    expect(user.create).toBeDefined();
  });
  it('checks /users/create is created correctly and SQL returns new user and JWT', async () => {
    const result = await request
      .post('/api/users')
      .send({
        name: 'lululu4',
        address: 'adress test lily',
        description: 'desc lily',
        password: '123456'
      })
      .set('Accept', 'application/json');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.name).toEqual('lululu4');
    expect(result.body.address).toEqual('adress test lily');
    expect(result.body.description).toEqual('desc lily');
    expect(result.body.password).not.toEqual('123456');
  });
});
describe('Tests get User endpoints exist', () => {
  it('checks getUser method exists', () => {
    expect(user.getUser).toBeDefined();
  });
  //此处不校验
  //   it('checks the users.getUser() method but returns 401, JWT not attached', async () => {
  //     const response = await request.get('/users');
  //     expect(response.status).toBe(401);
  //   });

  it('checks /users exists', async () => {
    console.log(token);
    const result = await request.get('/api/users');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body[0].name).toEqual('lily');
    expect(result.body[0].address).toEqual('adress test lily');
  });

  it('get /users should return a list of users with JWT', async () => {
    const result = await request.get('/api/users');
    expect(result.status).toBe(200);
    expect(result.body.length).toBe(23);
  });

  it('checks users getUser method exists', async () => {
    expect(user.getUser).toBeDefined();
  });

  it('checks /users/:id exists and checks SQL returns user id=2', async () => {
    const result = await request.get('/api/users/29');
    console.log('result.body is ', result.body);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.name).toEqual('lululu4');
  });
});
describe('Tests update User endpoints exist', () => {
  it('checks updateUser method exists', () => {
    expect(user.update).toBeDefined();
  });

  it('checks put /users/13 update exists and SQL updates DB Response', async () => {
    const userUpdate = {
      name: 'hell'
    };
    const result = await request
      .put('/api/users/13')
      .set('Authorization', 'Bearer ' + token)
      .send(userUpdate);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.name).toEqual('hell');
  });
});
describe('Tests delete User endpoints exist', () => {
  it('checks deleteUser method and SQL has deleted order', () => {
    expect(user.delete).toBeDefined();
  });

  it('checks /users/:id exists', async () => {
    const setup = await request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token);
    const result = await request
      .delete(`/api/users/21`)
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();

    const testDelete = await request
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token);
    expect(testDelete.body.length).toEqual(setup.body.length - 1);
  });
});
