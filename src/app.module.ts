import { Injectable, Logger, MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

import { AppController } from './app.controller';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { ImagesModule } from './api/images/images.module';
import { UsersModule } from './api/users/users.module';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`${method} ${statusCode} - ${originalUrl} - ${ip} - ${userAgent}`);
    });
    next();
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, ImagesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
