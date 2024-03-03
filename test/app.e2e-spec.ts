import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from './../src/app.module';

describe('my-image-sns (e2e)', () => {
  let app: INestApplication;
  let token: string;

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

    token = jwt.sign({ idx: 10000, userId: 'testuser' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    await app.init();
  });

  it('[GET] /', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('imageSNS (Backend)');
  });

  describe('[POST] /api/users', () => {
    it('신규 사용자 정보 등록', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        userId: 'testuser',
        userName: '김민순',
        password: 'pass1234!',
        type: 'user',
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        status: 0,
        msg: '회원가입이 정상적으로 처리되었습니다.',
        data: expect.any(Object),
      });
    });

    it('기존 사용자 정보 등록', async () => {
      const response = await request(app.getHttpServer()).post('/api/users').send({
        userId: 'testuser',
        userName: '김민순',
        password: 'pass1234!',
        type: 'user',
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ status: 1, msg: '이미 동일한 사용자가 존재합니다.' });
    });
  });

  describe('[POST] /api/login', () => {
    it('사용자 로그인', async () => {
      const response = await request(app.getHttpServer()).post('/api/login').send({
        userId: 'testuser',
        password: 'pass1234!',
        type: 'user',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('data.token');
    });

    it('로그인 불가 (아이디)', async () => {
      const response = await request(app.getHttpServer()).post('/api/login').send({
        userId: 'nonexistentuser',
        password: 'pass1234!',
        type: 'user',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        status: 1,
        msg: '사용자를 찾을 수 없습니다.',
      });
    });

    it('로그인 불가 (비밀번호)', async () => {
      const response = await request(app.getHttpServer()).post('/api/login').send({
        userId: 'testuser',
        password: 'wrongpassword',
        type: 'user',
      });

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        status: 2,
        msg: '비밀번호가 유효하지 않습니다.',
      });
    });
  });

  describe('[POST] /api/logout (TOKEN)', () => {
    it('사용자 로그아웃', async () => {
      const response = await request(app.getHttpServer()).post('/api/logout').set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: 0,
        msg: '성공적으로 로그아웃 하였습니다.',
      });
    });
  });

  describe('[POST] /api/images/upload-single (TOKEN)', () => {
    it('싱글 파일 업로드', async () => {
      const response = await request(app.getHttpServer()).post('/api/images/upload-single').set('Authorization', `Bearer ${token}`).field('type', 'profile').attach('image', 'test-image.jpg');

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        status: 0,
        msg: '이미지가 성공적으로 업로드 되었습니다.',
        data: expect.any(Object),
      });
    });
  });

  describe('[POST] /api/images/upload-multi (TOKEN)', () => {
    it('멀티 파일 업로드', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/images/upload-multi')
        .set('Authorization', `Bearer ${token}`)
        .field('type', 'profile')
        .attach('images', 'test-image.jpg')
        .attach('images', 'test-image2.jpg')
        .attach('images', 'test-image3.jpg');

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        status: 0,
        msg: '이미지가 성공적으로 업로드 되었습니다.',
        data: expect.any(Object),
      });
    });
  });

  describe('[GET] /api/images/by-user (TOKEN)', () => {
    it('사용자 업로드 이미지 조회', async () => {
      const response = await request(app.getHttpServer()).get(`/api/images/by-user`).set('Authorization', `Bearer ${token}`).query({ userIdx: 10000, date: '2024-03-03', type: 'basic' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: 0,
        msg: '업로드한 이미지 목록을 출력합니다.',
        data: expect.any(Object),
      });
    });
  });

  describe('[GET] /api/images/by-total (TOKEN)', () => {
    it('전체 업로드 이미지 조회', async () => {
      const response = await request(app.getHttpServer()).get('/api/images/by-total').set('Authorization', `Bearer ${token}`).query({ date: '2024-03-03' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        status: 0,
        msg: '업로드한 이미지 목록을 출력합니다.',
        data: expect.any(Object),
      });
    });
  });
});
