import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Response } from 'express';

import { LoginUserDto } from './dtos/login-user.dto';
import { User } from './entities/user.entity';
import * as authUtil from '../utils/auth.util';

@Injectable()
export class ApiService {
  // constructor(@InjectRepository(User) private repo: Repository<User>) {}
  constructor(@Inject('USER_REPOSITORY') private userRepository: Repository<User>) {}

  async login(loginUserData: LoginUserDto, res: Response): Promise<any> {
    const { userId, password } = loginUserData;

    let type = 'user';
    if (loginUserData.type) type = loginUserData.type;

    const user = await this.userRepository.findOne({
      where: { userId, type },
    });
    if (!user) {
      return res.status(400).json({ status: 1, msg: '사용자를 찾을 수 없습니다.' });
    }

    if (!(await authUtil.compareWithHash(password, user.password))) {
      return res.status(400).json({ status: 2, msg: '비밀번호가 유효하지 않습니다.' });
    }

    const token = jwt.sign({ idx: user.idx, userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie(process.env.COOKIE_NAME, token, {
      domain: '.localhost',
      maxAge: 3600 * 1000,
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ status: 0, msg: '성공적으로 로그인 되었습니다.', data: { token } });
  }

  async logout(res: Response): Promise<any> {
    res.clearCookie(process.env.COOKIE_NAME);
    res.status(200).json({ status: 0, msg: '성공적으로 로그아웃 하였습니다.' });
  }
}
