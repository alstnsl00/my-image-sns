import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { User } from './entities/user.entity';
import { DatabaseModule } from '../datasources/database.module';
import { ImagesModule } from './images/images.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, ImagesModule, UsersModule],
  controllers: [ApiController],
  providers: [
    ApiService,
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [ApiModule],
})
export class ApiModule {}
