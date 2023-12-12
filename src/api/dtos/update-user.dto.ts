import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 이름' })
  readonly userName: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '사용자 비밀번호' })
  readonly password: string;
}
