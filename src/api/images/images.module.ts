import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { Image } from '../entities/image.entity';
import { Comment } from '../entities/comment.entity';
import { MulterConfigService } from '../common/multer.config';
import { DatabaseModule } from '../../datasources/database.module';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    {
      provide: 'IMAGE_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Image),
      inject: ['DATA_SOURCE'],
    },
    {
      provide: 'COMMENT_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [ImagesModule],
})
export class ImagesModule {}
