import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UserImageDto {
  @IsString()
  @ApiProperty({ description: '사용자 아이디' })
  readonly userId: string;

  @IsString()
  @ApiProperty({ description: '이미지 조회 날짜' })
  readonly date: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 조회 타입' })
  readonly type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 조회 정렬 방식' })
  readonly sort: string;
}
