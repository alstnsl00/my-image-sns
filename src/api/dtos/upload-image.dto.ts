import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  @ApiProperty({ description: '사용자 아이디' })
  readonly userId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '이미지 구분' })
  readonly type: string;
}
