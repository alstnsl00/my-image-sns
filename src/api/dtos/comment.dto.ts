import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @ApiProperty({ description: '사용자 아이디' })
  readonly userId: string;

  @IsString()
  @ApiProperty({ description: '댓글' })
  readonly comment: string;
}
