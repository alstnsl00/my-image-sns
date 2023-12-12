import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ description: '사용자 아이디' })
  readonly userId: string;

  @IsString()
  @ApiProperty({ description: '사용자 이름' })
  readonly userName: string;

  @IsString()
  @ApiProperty({ description: '사용자 패스워드' })
  readonly password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 구분' })
  readonly type: string;
}
