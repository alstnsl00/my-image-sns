import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // 이건 뭐지?
import { Repository } from 'typeorm';

import * as authUtil from '../../utils/auth.util';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { Result } from '../common/result.class';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  // constructor(@InjectRepository(User) private repo: Repository<User>) {}
  constructor(@Inject('USER_REPOSITORY') private userRepository: Repository<User>) {}

  async join(createUserData: CreateUserDto): Promise<Result> {
    const { userId, userName, password, type } = createUserData;

    const existUser = await this.userRepository.findOne({
      where: { userId },
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

  async modify(id: number, updateUserData: UpdateUserDto): Promise<Result> {
    const { userName, password } = updateUserData;

    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      return { status: 1, msg: '사용자를 찾을 수 없습니다.' };
    }

    if (userName) {
      user.userName = userName;
      try {
        const updateUser = await this.userRepository.save(user);

        return { status: 0, msg: '회원정보가 정상적으로 갱신되었습니다.', data: updateUser };
      } catch (e) {
        return { status: 2, msg: `회원정보 갱신간 예기치 않은 오류가 발생하였습니다. [${e}]` };
      }
    }

    if (password) {
      if ((await authUtil.validateWithWord(password)) === 'regError') {
        return { status: 3, msg: '비밀번호가 유효하지 않습니다.' };
      }

      const hashedPassword = await authUtil.createHashedPassword(password);

      user.password = hashedPassword;
      try {
        const updateUser = await this.userRepository.save(user);
        return { status: 0, msg: '회원정보가 정상적으로 갱신되었습니다.', data: updateUser };
      } catch (e) {
        return { status: 4, msg: `회원가입간 예기치 않은 오류가 발생하였습니다. [${e}]` };
      }
    }

    return { status: 5, msg: '갱신할 정보를 입력하여 주십시오.' };
  }
}
