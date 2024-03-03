import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class TotalImageDto {
  @IsString()
  @ApiProperty({ description: '이미지 조회 날짜' })
  readonly date: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '이미지 조회 페이지 번호' })
  readonly num: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({ description: '이미지 조회 페이지 갯수' })
  readonly offset: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 조회 정렬 방식' })
  readonly sort: string;
}
