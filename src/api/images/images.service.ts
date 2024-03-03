import { Inject, Injectable } from '@nestjs/common';
import { Equal, Raw, Repository } from 'typeorm';
import * as fs from 'fs';

import { Image } from '../entities/image.entity';
import { Comment } from '../entities/comment.entity';
import { Result } from '../common/result.class';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { UserImageDto } from '../dtos/user-image.dto';
import { TotalImageDto } from '../dtos/total-image.dto';
import { CommentDto } from '../dtos/comment.dto';

@Injectable()
export class ImagesService {
  // constructor(@InjectRepository(Image) private repo: Repository<Image>) {}
  constructor(@Inject('IMAGE_REPOSITORY') private imageRepository: Repository<Image>, @Inject('COMMENT_REPOSITORY') private commentRepository: Repository<Comment>) {}

  async upload(file: Express.Multer.File, uploadImageData: UploadImageDto): Promise<Result> {
    const { userId, type } = uploadImageData;

    try {
      const newImage = await this.imageRepository.save({
        userId,
        filename: file.filename,
        type,
      });
      return { status: 0, msg: '이미지가 성공적으로 업로드 되었습니다.', data: newImage };
    } catch (e) {
      return { status: 3, msg: `이미지 업로드간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async uploads(files: Array<Express.Multer.File>, uploadImageData: UploadImageDto): Promise<Result> {
    const { userId, type } = uploadImageData;

    if (files['images'].length > 0) {
      if (Array.isArray(files['images'])) {
        const images = files['images'].map((e) => {
          return {
            userId,
            filename: e.filename,
            type,
          };
        });

        try {
          const newImages = await this.imageRepository.save(images);

          return { status: 0, msg: '이미지가 성공적으로 업로드 되었습니다.', data: newImages };
        } catch (e) {
          return { status: 1, msg: `이미지 업로드간 예기치 않은 오류가 발생하였습니다. [${e}]` };
        }
      } else {
        try {
          const newImage = await this.imageRepository.save({
            userId,
            filename: files['images'][0].filename,
            type,
          });

          return { status: 0, msg: '이미지가 성공적으로 업로드 되었습니다.', data: newImage };
        } catch (e) {
          return { status: 2, msg: `이미지 업로드간 예기치 않은 오류가 발생하였습니다. [${e}]` };
        }
      }
    } else {
      return {
        status: 5,
        msg: '업로드할 이미지가 없습니다.',
      };
    }
  }

  async userImage(userId: string, userImageData: UserImageDto): Promise<Result> {
    const { date, type, sort } = userImageData;

    let images: Array<any>;
    try {
      if (sort === 'desc') {
        images = await this.imageRepository.find({
          where: {
            type: Equal(type),
            createdAt: Raw((alias) => `${alias} > :startDate and ${alias} <= datetime(:endDate, '+1 days')`, { startDate: date, endDate: date }), // sqlite
            userId,
          },
          order: {
            id: 'DESC',
          },
        });
      } else {
        images = await this.imageRepository.find({
          where: {
            type: Equal(type),
            createdAt: Raw((alias) => `${alias} > :startDate and ${alias} <= datetime(:endDate, '+1 days')`, { startDate: date, endDate: date }), // sqlite
            userId,
          },
        });
      }
      return { status: 0, msg: '업로드한 이미지 목록을 출력합니다.', data: images };
    } catch (e) {
      return { status: 1, msg: `업로드한 이미지가 없습니다. [${e}]` };
    }
  }

  async totalImage(totalImageData: TotalImageDto): Promise<Result> {
    const { date, sort, num = 1, offset = 10 } = totalImageData;

    const totalNum = await this.imageRepository.count({
      where: {
        createdAt: Raw((alias) => `${alias} > :startDate and ${alias} <= datetime(:endDate, '+1 days')`, { startDate: date, endDate: date }), // sqlite
      },
    });

    let images: Array<any>;
    try {
      if (sort === 'desc') {
        images = await this.imageRepository.find({
          where: {
            createdAt: Raw((alias) => `${alias} > :startDate and ${alias} <= datetime(:endDate, '+1 days')`, { startDate: date, endDate: date }), // sqlite
          },
          order: {
            id: 'DESC',
          },
          skip: (Number(num) - 1) * Number(offset),
          take: Number(offset),
        });
      } else {
        images = await this.imageRepository.find({
          where: {
            createdAt: Raw((alias) => `${alias} > :startDate and ${alias} <= datetime(:endDate, '+1 days')`, { startDate: date, endDate: date }), // sqlite
          },
          skip: (Number(num) - 1) * Number(offset),
          take: Number(offset),
        });
      }
      return { status: 0, msg: '업로드한 이미지 목록을 출력합니다.', data: { images, num: Number(num), totalNum: Math.round(totalNum / Number(offset)) } };
    } catch (e) {
      return { status: 1, msg: `업로드한 이미지가 없습니다. [${e}]` };
    }
  }

  async updateImage(file: Express.Multer.File, imageId: number, type: string): Promise<Result> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) return { status: 1, msg: '해당 이미지가 없습니다.' };

    try {
      await this.imageRepository.update(image.id, {
        filename: file.filename,
        type: type['type'],
        updatedAt: new Date(),
      });

      const newImage = await this.imageRepository.findOne({
        where: { id: imageId },
      });

      fs.unlinkSync(`./uploads/${image.filename}`);
      return { status: 0, msg: '이미지 정보가 업데이트 되었습니다.', data: newImage };
    } catch (e) {
      return { status: 1, msg: `이미지 정보 업데이트간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async deleteImage(imageId: number, userId: string): Promise<Result> {
    try {
      const image = await this.imageRepository.findOne({
        where: { id: imageId },
      });

      // 보안 처리 추가해야 함
      if (image.userId === userId['userId']) {
        fs.unlinkSync(`./uploads/${image.filename}`);

        await this.imageRepository.delete({ id: imageId });
        return { status: 0, msg: '이미지가 정상적으로 삭제되었습니다.' };
      } else {
        return { status: 1, msg: '이미지 삭제는 본인만 가능합니다.' };
      }
    } catch (e) {
      return { status: 2, msg: `이미지 삭제간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async addComment(imageId: number, commentData: CommentDto): Promise<Result> {
    const { userId, comment } = commentData;

    try {
      const newComment = await this.commentRepository.save({
        imageId,
        userId,
        comment,
      });
      return { status: 0, msg: '이미지에 댓글이 입력되었습니다.', data: newComment };
    } catch (e) {
      return { status: 1, msg: `이미지에 댓글 입력간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async comment(imageId: number): Promise<Result> {
    try {
      const comment = await this.commentRepository.find({
        where: {
          imageId,
        },
        order: {
          id: 'DESC',
        },
      });
      return { status: 0, msg: '현재 이미지의 댓글을 출력합니다.', data: comment };
    } catch (e) {
      return { status: 1, msg: `이미지의 댓글 출력간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async modifyComment(imageId: number, commentId: number, commentData: CommentDto): Promise<Result> {
    const { userId, comment } = commentData;
    const modifyComment = await this.commentRepository.findOne({
      where: { id: commentId, imageId },
    });
    if (!modifyComment) return { status: 1, msg: '해당 댓글이 없습니다.' };
    try {
      // 보안 처리 추가해야 함
      if (modifyComment.userId === userId) {
        await this.commentRepository.update(modifyComment.id, {
          comment: comment['comment'],
          updatedAt: new Date(),
        });
  
        const newComment = await this.commentRepository.findOne({
          where: { id: commentId },
        });
  
        return { status: 0, msg: '댓글 정보가 업데이트 되었습니다.', data: newComment };
      } else {
        return { status: 1, msg: '댓글 수정은 본인만 가능합니다.' };
      }

      
    } catch (e) {
      return { status: 1, msg: `댓글 정보 업데이트간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async removeComment(imageId: number, commentId: number, commentData: CommentDto): Promise<Result> {
    const { userId } = commentData;
    try {
      const removeComment = await this.commentRepository.findOne({
        where: { id: commentId, imageId },
      });

      // 보안 처리 추가해야 함
      if (removeComment.userId === userId) {
        await this.commentRepository.delete({ id: commentId });
        return { status: 0, msg: '댓글이 정상적으로 삭제되었습니다.' };
      } else {
        return { status: 1, msg: '댓글 삭제는 본인만 가능합니다.' };
      }
    } catch (e) {
      return { status: 2, msg: `댓글 삭제간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }
}
