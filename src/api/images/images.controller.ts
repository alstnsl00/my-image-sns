import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ImagesService } from './images.service';
import { Result } from '../common/result.class';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { UserImageDto } from '../dtos/user-image.dto';
import { TotalImageDto } from '../dtos/total-image.dto';
import { CommentDto } from '../dtos/comment.dto';
import { UpdateImageDto } from '../dtos/update-image.dto';

@Controller('api/images')
@ApiTags('이미지 관련 처리')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('/upload-single')
  @ApiOperation({ summary: '싱글 파일 업로드' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File, @Body(new ValidationPipe()) uploadImageData: UploadImageDto, @Req() req: Request): Promise<Result> {
    return await this.imagesService.upload(file, uploadImageData, req);
  }

  @Post('/upload-multi')
  @ApiOperation({ summary: '멀티 파일 업로드' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async uploadMulti(@UploadedFiles() files: Array<Express.Multer.File>, @Body(new ValidationPipe()) uploadImageData: UploadImageDto, @Req() req: Request): Promise<Result> {
    return await this.imagesService.uploads(files, uploadImageData, req);
  }

  @Get('/by-user')
  @ApiOperation({ summary: '사용자 업로드 이미지 조회' })
  async user(@Query() userImageData: UserImageDto): Promise<Result> {
    return await this.imagesService.userImage(userImageData);
  }

  @Get('/by-total')
  @ApiOperation({ summary: '전체 업로드 이미지 조회' })
  async total(@Query() totalImageData: TotalImageDto): Promise<Result> {
    return await this.imagesService.totalImage(totalImageData);
  }

  @Put('/:imageIdx')
  @ApiOperation({ summary: '업로드 이미지 정보 수정' })
  @UseInterceptors(FileInterceptor('image'))
  async update(@UploadedFile() file: Express.Multer.File, @Param('imageIdx', new ParseIntPipe()) imageIdx: number, @Body() updateImageData: UpdateImageDto, @Req() req: Request): Promise<Result> {
    if (+imageIdx < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.updateImage(file, imageIdx, updateImageData, req);
  }

  @Delete('/:imageIdx')
  @ApiOperation({ summary: '업로드 이미지 삭제' })
  async delete(@Param('imageIdx', new ParseIntPipe()) imageIdx: number, @Req() req: Request): Promise<Result> {
    if (+imageIdx < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.deleteImage(imageIdx, req);
  }

  @Post('/:imageIdx/comments')
  @ApiOperation({ summary: '이미지의 댓글 등록' })
  async add(@Param('imageIdx', new ParseIntPipe()) imageIdx: number, @Body(new ValidationPipe()) commentData: CommentDto, @Req() req: Request): Promise<Result> {
    if (+imageIdx < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.addComment(imageIdx, commentData, req);
  }

  @Get('/:imageIdx/comments')
  @ApiOperation({ summary: '이미지의 댓글 조회' })
  async get(@Param('imageIdx', new ParseIntPipe()) imageIdx: number): Promise<Result> {
    if (+imageIdx < 1) {
      throw new BadRequestException('imageId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.comment(imageIdx);
  }

  @Put('/:imageIdx/comments/:commentIdx')
  @ApiOperation({ summary: '이미지의 댓글 수정' })
  async modify(
    @Param('imageIdx', new ParseIntPipe()) imageIdx: number,
    @Param('commentIdx', new ParseIntPipe()) commentIdx: number,
    @Body(new ValidationPipe()) commentData: CommentDto,
    @Req() req: Request,
  ): Promise<Result> {
    if (+commentIdx < 1) {
      throw new BadRequestException('commentId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.modifyComment(imageIdx, commentIdx, commentData, req);
  }

  @Delete('/:imageIdx/comments/:commentIdx')
  @ApiOperation({ summary: '이미지의 댓글 삭제' })
  async remove(@Param('imageIdx', new ParseIntPipe()) imageIdx: number, @Param('commentIdx', new ParseIntPipe()) commentIdx: number, @Req() req: Request): Promise<Result> {
    if (+commentIdx < 1) {
      throw new BadRequestException('commentId는 0보다 큰 값이어야 합니다.');
    }

    return await this.imagesService.removeComment(imageIdx, commentIdx, req);
  }
}
