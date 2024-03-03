import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class UserImageDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '사용자 인덱스' })
  readonly userIdx: number;

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
