import { Body, Controller, Post, ValidationPipe, Param, Put, ParseIntPipe, BadRequestException, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { UsersService } from './users.service';
import { Result } from '../common/result.class';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';

@Controller('api')
@ApiTags('사용자 관련 처리')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  @ApiOperation({ summary: '사용자 로그인' })
  async login(@Body(new ValidationPipe()) loginUserData: LoginUserDto, @Res() res: Response): Promise<Result> {
    return await this.usersService.login(loginUserData, res);
  }

  @Post('/logout')
  @ApiOperation({ summary: '사용자 로그아웃' })
  async logout(@Res() res: Response): Promise<Result> {
    return await this.usersService.logout(res);
  }

  @Post('/users')
  @ApiOperation({ summary: '사용자 정보 등록' })
  async join(@Body(new ValidationPipe()) joinUserData: CreateUserDto): Promise<Result> {
    return await this.usersService.join(joinUserData);
  }

  @Put('/users/:idx')
  @ApiOperation({ summary: '사용자 정보 수정' })
  async modify(@Param('idx', new ParseIntPipe()) id: number, @Body(new ValidationPipe()) updateUserData: UpdateUserDto): Promise<Result> {
    if (+id < 1) {
      throw new BadRequestException('idx는 0보다 큰 값이어야 합니다.');
    }

    return await this.usersService.modify(id, updateUserData);
  }
}
