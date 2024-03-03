import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 구분' })
  readonly type: string;
}
