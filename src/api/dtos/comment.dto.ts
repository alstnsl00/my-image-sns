import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '댓글' })
  readonly comment: string;
}
