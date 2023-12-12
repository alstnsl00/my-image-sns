import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class TotalImageDto {
  @IsString()
  @ApiProperty({ description: '이미지 조회 날짜' })
  readonly date: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 조회 페이지 번호' })
  readonly num: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 조회 페이지 갯수' })
  readonly offset: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 조회 정렬 방식' })
  readonly sort: string;
}
