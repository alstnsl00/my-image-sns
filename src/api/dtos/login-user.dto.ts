import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @ApiProperty({ description: '사용자 비밀번호' })
  readonly password: string;

  @IsString()
  @ApiProperty({ description: '사용자 구분' })
  readonly type: string;
}
