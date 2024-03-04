import { Inject, Injectable, Options } from '@nestjs/common';
import { Equal, Raw, Repository } from 'typeorm';
import * as fs from 'fs';

import { Image } from '../entities/image.entity';
import { Comment } from '../entities/comment.entity';
import { Result } from '../common/result.class';
import { UploadImageDto } from '../dtos/upload-image.dto';
import { UserImageDto } from '../dtos/user-image.dto';
import { TotalImageDto } from '../dtos/total-image.dto';
import { CommentDto } from '../dtos/comment.dto';
import { UpdateImageDto } from '../dtos/update-image.dto';

@Injectable()
export class ImagesService {
  // constructor(@InjectRepository(Image) private repo: Repository<Image>) {}
  constructor(@Inject('IMAGE_REPOSITORY') private imageRepository: Repository<Image>, @Inject('COMMENT_REPOSITORY') private commentRepository: Repository<Comment>) {}

  async upload(file: Express.Multer.File, uploadImageData: UploadImageDto, req: any): Promise<Result> {
    const { type } = uploadImageData;

    try {
      const newImage = await this.imageRepository.save({
        userIdx: req.idx,
        filename: file.filename,
        type,
      });
      return { status: 0, msg: '이미지가 성공적으로 업로드 되었습니다.', data: newImage };
    } catch (e) {
      return { status: 1, msg: `이미지 업로드간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async uploads(files: Array<Express.Multer.File>, uploadImageData: UploadImageDto, req: any): Promise<Result> {
    const { type } = uploadImageData;

    if (files['images'].length > 0) {
      if (Array.isArray(files['images'])) {
        const images = files['images'].map((e) => {
          return {
            userIdx: req.idx,
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
            userIdx: req.idx,
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

  async userImage(userImageData: UserImageDto): Promise<Result> {
    const { userIdx, date, type, sort } = userImageData;

    let images: Array<any>;
    try {
      if (sort === 'desc') {
        images = await this.imageRepository.find({
          where: {
            type: Equal(type),
            createdAt: Raw((alias) => `${alias} > :startDate and ${alias} <= datetime(:endDate, '+1 days')`, { startDate: date, endDate: date }), // sqlite
            userIdx: Equal(Number(userIdx)),
          },
          order: {
            idx: 'DESC',
          },
        });
      } else {
        images = await this.imageRepository.find({
          where: {
            type: Equal(type),
            createdAt: Raw((alias) => `${alias} > :startDate and ${alias} <= datetime(:endDate, '+1 days')`, { startDate: date, endDate: date }), // sqlite
            userIdx: Equal(Number(userIdx)),
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
            idx: 'DESC',
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

  async updateImage(file: Express.Multer.File, imageIdx: number, updateImageData: UpdateImageDto, req: any): Promise<Result> {
    const { type } = updateImageData;
    const image = await this.imageRepository.findOne({
      where: { idx: imageIdx },
    });
    if (!image) return { status: 1, msg: '해당 이미지가 없습니다.' };

    try {
      if (image.userIdx === req.idx) {
        let option = {
          updatedAt: new Date(),
        };
        if (file) option['filename'] = file.filename;
        if (type) option['type'] = type;

        await this.imageRepository.update(image.idx, option);

        try {
          if (file) fs.unlinkSync(`./uploads/${image.filename}`);
        } catch (e) {
          return { status: 4, msg: `이미지 정보 업데이트간 예기치 않은 오류가 발생하였습니다. [${e}]` };
        }

        const newImage = await this.imageRepository.findOne({
          where: { idx: imageIdx },
        });

        return { status: 0, msg: '이미지 정보가 업데이트 되었습니다.', data: newImage };
      } else {
        return { status: 2, msg: '이미지 정보 업데이트는 본인만 가능합니다.' };
      }
    } catch (e) {
      return { status: 3, msg: `이미지 정보 업데이트간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }
  async deleteImage(imageIdx: number, req: any): Promise<Result> {
    try {
      const image = await this.imageRepository.findOne({
        where: { idx: imageIdx },
      });

      if (image.userIdx === req.idx) {
        fs.unlinkSync(`./uploads/${image.filename}`);

        await this.imageRepository.delete({ idx: imageIdx });
        return { status: 0, msg: '이미지가 정상적으로 삭제되었습니다.' };
      } else {
        return { status: 1, msg: '이미지 삭제는 본인만 가능합니다.' };
      }
    } catch (e) {
      return { status: 2, msg: `이미지 삭제간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async addComment(imageIdx: number, commentData: CommentDto, req: any): Promise<Result> {
    const { comment } = commentData;

    try {
      const newComment = await this.commentRepository.save({
        imageIdx,
        userIdx: req.idx,
        comment,
      });
      return { status: 0, msg: '이미지에 댓글이 입력되었습니다.', data: newComment };
    } catch (e) {
      return { status: 1, msg: `이미지에 댓글 입력간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async comment(imageIdx: number): Promise<Result> {
    try {
      const comment = await this.commentRepository.find({
        where: {
          imageIdx,
        },
        order: {
          idx: 'DESC',
        },
      });
      return { status: 0, msg: '현재 이미지의 댓글을 출력합니다.', data: comment };
    } catch (e) {
      return { status: 1, msg: `이미지의 댓글 출력간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async modifyComment(imageIdx: number, commentIdx: number, commentData: CommentDto, req: any): Promise<Result> {
    const { comment } = commentData;
    const modifyComment = await this.commentRepository.findOne({
      where: { idx: commentIdx, imageIdx },
    });

    if (!modifyComment) return { status: 1, msg: '해당 댓글이 없습니다.' };
    try {
      if (modifyComment.userIdx === req.idx) {
        await this.commentRepository.update(modifyComment.idx, {
          comment,
          updatedAt: new Date(),
        });

        const newComment = await this.commentRepository.findOne({
          where: { idx: commentIdx, imageIdx },
        });

        return { status: 0, msg: '댓글 정보가 업데이트 되었습니다.', data: newComment };
      } else {
        return { status: 2, msg: '댓글 수정은 본인만 가능합니다.' };
      }
    } catch (e) {
      return { status: 3, msg: `댓글 수정간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }

  async removeComment(imageIdx: number, commentIdx: number, req: any): Promise<Result> {
    try {
      const removeComment = await this.commentRepository.findOne({
        where: { idx: commentIdx, imageIdx },
      });

      if (removeComment.userIdx === req.idx) {
        await this.commentRepository.delete({ idx: commentIdx });
        return { status: 0, msg: '댓글이 정상적으로 삭제되었습니다.' };
      } else {
        return { status: 1, msg: '댓글 삭제는 본인만 가능합니다.' };
      }
    } catch (e) {
      return { status: 2, msg: `댓글 삭제간 예기치 않은 오류가 발생하였습니다. [${e}]` };
    }
  }
}
