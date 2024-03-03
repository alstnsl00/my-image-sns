import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { whiteListUrl } from '../const';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    let token: string;
    const authHeader = req.headers.authorization;
    if (authHeader) token = authHeader.split(' ')[1];

    if (!whiteListUrl.includes(req.originalUrl)) {
      if (!token) {
        token = req.cookies[process.env.COOKIE_NAME];
        if (!token) return res.status(401).json({ status: 1, msg: '허용된 요청을 위해 로그인을 해주십시오.' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded['idx']) {
          req.idx = decoded['idx'];
          next();
        }
      } catch (err) {
        return res.status(401).json({ status: 2, msg: '허용된 요청을 위해 로그인을 해주십시오.' });
      }
    } else {
      next();
    }
  }
}
