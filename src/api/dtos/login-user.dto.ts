import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @ApiProperty({ description: '사용자 아이디' })
  readonly userId: string;

  @IsString()
  @ApiProperty({ description: '사용자 비밀번호' })
  readonly password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 구분' })
  readonly type: string;
}
