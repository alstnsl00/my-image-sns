import { Body, Controller, Post, ValidationPipe, Param, Put, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Result } from '../common/result.interface';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('사용자 관련 처리')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  @ApiOperation({ summary: '사용자 정보 등록' })
  async join(@Body(new ValidationPipe()) joinUserData: CreateUserDto): Promise<Result> {
    return await this.usersService.join(joinUserData);
  }

  @Put('/:id')
  @ApiOperation({ summary: '사용자 정보 수정' })
  async modify(@Param('id', new ParseIntPipe()) id: number, @Body(new ValidationPipe()) updateUserData: UpdateUserDto): Promise<Result> {
    if (+id < 1) {
      throw new BadRequestException('id는 0보다 큰 값이어야 합니다.');
    }

    return await this.usersService.modify(id, updateUserData);
  }
}
