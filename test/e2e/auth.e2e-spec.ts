import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/auth/register (POST)', () => {
    it('should register a new user', () => {
      const uniqueUsername = `testuser_${Date.now()}`;
      const uniqueEmail = `test_${Date.now()}@example.com`;
      
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: uniqueUsername,
          email: uniqueEmail,
          password: 'password123',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.username).toBe(uniqueUsername);
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should fail with duplicate username', async () => {
      const uniqueUsername = `duplicate_${Date.now()}`;
      const uniqueEmail1 = `test1_${Date.now()}@example.com`;
      const uniqueEmail2 = `test2_${Date.now()}@example.com`;

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: uniqueUsername,
          email: uniqueEmail1,
          password: 'password123',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: uniqueUsername,
          email: uniqueEmail2,
          password: 'password123',
        })
        .expect(409);
    });
  });

  describe('/api/v1/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      const uniqueUsername = `loginuser_${Date.now()}`;
      const uniqueEmail = `login_${Date.now()}@example.com`;

      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: uniqueUsername,
          email: uniqueEmail,
          password: 'password123',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: uniqueUsername,
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('user');
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'nonexistent',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
