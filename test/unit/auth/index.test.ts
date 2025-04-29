import { HttpCode } from '../../../src/constants/http';
import { initializeDatabase } from '../../../src/database';
import { createApp } from '../../../src/server';
import supertest from 'supertest';


const mockUser = {
  "username": "Chapp",
  "email": "alex@chap.com",
  "password": "qwezxc"
}

describe('POST /auth/register', async () => {
  await initializeDatabase(); // First connect to DB
  const app = createApp();    // Init express app
  const request = supertest(app);

  return request
    .post("/api/auth/register")
    .send(mockUser)
    .expect('Content-Type', /json/)
    .expect(HttpCode.CREATED)
    .then((res) => {
      expect(res.statusCode).toBe(HttpCode.CREATED);
    })
});

describe('POST /auth/login', async () => {
  await initializeDatabase(); // First connect to DB
  const app = createApp();    // Init express app
  const request = supertest(app);

  return request
    .post("/api/auth/login")
    .send(mockUser)
    .expect('Content-Type', /json/)
    .expect(HttpCode.OK)
    .then((res) => {
      expect(res.statusCode).toBe(HttpCode.CREATED);
      expect(res.body.access_token).not.toBe(null);
      expect(res.body.refresh_token).not.toBe(null);
    })
});

describe('DELETE /api/auth/delete-account', async () => {
  await initializeDatabase(); // First connect to DB
  const app = createApp();    // Init express app
  const request = supertest(app);

  test("should delete user from db", async () => {
    return request
      .delete(`/api/auth/delete-account`)
      .expect(HttpCode.UNAUTHORIZED)
  });
});