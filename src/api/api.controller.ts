import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Result } from './common/result.class';
import { LoginUserDto } from './dtos/login-user.dto';
import { ApiService } from './api.service';

@Controller()
@ApiTags('로그인/로그아웃')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('/login')
  @ApiOperation({ summary: '사용자 로그인' })
  async login(@Body(new ValidationPipe()) loginUserData: LoginUserDto, @Res() res: Response): Promise<Result> {
    return await this.apiService.login(loginUserData, res);
  }

  @Post('/logout')
  @ApiOperation({ summary: '사용자 로그아웃' })
  async logout(@Res() res: Response): Promise<Result> {
    return await this.apiService.logout(res);
  }
}
