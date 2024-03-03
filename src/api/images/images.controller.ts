import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ImagesService } from './images.service';
import { Result } from '../common/result.class';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { UserImageDto } from '../dtos/user-image.dto';
import { TotalImageDto } from '../dtos/total-image.dto';
import { CommentDto } from '../dtos/comment.dto';

@Controller('images')
@ApiTags('이미지 관련 처리')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/upload-single')
  @ApiOperation({ summary: '싱글 파일 업로드' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe()) uploadImageData: UploadImageDto): Promise<Result> {
    return await this.imagesService.upload(file, uploadImageData);
  }

  @Post('/upload-multi')
  @ApiOperation({ summary: '멀티 파일 업로드' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async uploadMulti(@UploadedFiles() files: Array<Express.Multer.File>, @Body(new ValidationPipe()) uploadImageData: UploadImageDto): Promise<Result> {
    return await this.imagesService.uploads(files, uploadImageData);
  }

  @Get('/:userId')
  @ApiOperation({ summary: '사용자 업로드 이미지 조회' })
  async user(@Param() userId: string, @Query() userImageData: UserImageDto): Promise<Result> {
    return await this.imagesService.userImage(userId, userImageData);
  }

  @Get('/total')
  @ApiOperation({ summary: '전체 업로드 이미지 조회' })
  async total(@Query() totalImageData: TotalImageDto): Promise<Result> {
    return await this.imagesService.totalImage(totalImageData);
  }

  @Put('/:imageId')
  @ApiOperation({ summary: '업로드 이미지 정보 수정' })
  @UseInterceptors(FileInterceptor('image'))
  async update(@UploadedFile() file: Express.Multer.File, @Param('imageId', new ParseIntPipe()) imageId: number, @Body() type: string): Promise<Result> {
    if (+imageId < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.updateImage(file, imageId, type);
  }

  @Delete('/:imageId')
  @ApiOperation({ summary: '업로드 이미지 삭제' })
  async delete(@Param('imageId', new ParseIntPipe()) imageId: number, @Query() userId: string): Promise<Result> {
    if (+imageId < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.deleteImage(imageId, userId);
  }

  @Post('/:imageId/comments')
  @ApiOperation({ summary: '이미지의 댓글 등록' })
  async add(@Param('imageId', new ParseIntPipe()) imageId: number, @Body(new ValidationPipe()) commentData: CommentDto): Promise<Result> {
    if (+imageId < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.addComment(imageId, commentData);
  }

  @Get('/:imageId/comments')
  @ApiOperation({ summary: '이미지의 댓글 조회' })
  async get(@Param('imageId', new ParseIntPipe()) imageId: number): Promise<Result> {
    if (+imageId < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.comment(imageId);
  }

  @Put('/:imageId/comments/:commentId')
  @ApiOperation({ summary: '이미지의 댓글 수정' })
  async modify(@Param('imageId', new ParseIntPipe()) imageId: number, @Param('commentId', new ParseIntPipe()) commentId: number, @Body(new ValidationPipe()) commentData: CommentDto): Promise<Result> {
    if (+commentId < 1) {
      throw new BadRequestException('commentId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.modifyComment(imageId, commentId, commentData);
  }

  @Delete('/:imageId/comments/:commentId')
  @ApiOperation({ summary: '이미지의 댓글 삭제' })
  async remove(@Param('imageId', new ParseIntPipe()) imageId: number, @Param('commentId', new ParseIntPipe()) commentId: number, @Body(new ValidationPipe()) commentData: CommentDto): Promise<Result> {
    if (+commentId < 1) {
      throw new BadRequestException('commentId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.removeComment(imageId, commentId, commentData);
  }
}
