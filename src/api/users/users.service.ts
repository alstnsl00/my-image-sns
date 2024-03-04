import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';

import * as authUtil from '../../utils/auth.util';
import { User } from '../entities/user.entity';
import { Result } from '../common/result.class';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';

@Injectable()
export class UsersService {
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

  async join(createUserData: CreateUserDto): Promise<Result> {
    const { userId, userName, password, type } = createUserData;

    const existUser = await this.userRepository.findOne({
      where: { userId, type },
    });
    if (existUser) {
      return { status: 1, msg: '이미 동일한 사용자가 존재합니다.' };
    }

    if ((await authUtil.validateWithWord(password)) === 'regError') {
      return { status: 2, msg: '비밀번호가 유효하지 않습니다.' };
    }

    const hashedPassword = await authUtil.createHashedPassword(password);

    try {
      const newUser = await this.userRepository.save({
        userId,
        userName,
        password: hashedPassword,
        type,
      });
      return { status: 0, msg: '회원가입이 정상적으로 처리되었습니다.', data: newUser };
    } catch (e) {
      return { status: 3, msg: `회원가입간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async modify(idx: number, updateUserData: UpdateUserDto): Promise<Result> {
    const { userName, password } = updateUserData;

    const user = await this.userRepository.findOne({
      where: { idx },
    });
    if (!user) {
      return { status: 1, msg: '사용자를 찾을 수 없습니다.' };
    }

    if (userName) user.userName = userName;
    if (password) {
      const hashedPassword = await authUtil.createHashedPassword(password);
      user.password = hashedPassword;
    }

    if (userName || password) {
      try {
        const updateUser = await this.userRepository.save(user);

        return { status: 0, msg: '회원정보가 정상적으로 갱신되었습니다.', data: updateUser };
      } catch (e) {
        return { status: 2, msg: `회원정보 갱신간 예기치 않은 오류가 발생하였습니다. [${e}]` };
      }
    } else {
      return { status: 3, msg: '갱신할 정보를 입력하여 주십시오.' };
    }
  }
}
