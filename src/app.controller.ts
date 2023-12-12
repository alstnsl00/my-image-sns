import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  init(): string {
    return 'Welcome to my studyNest API';
  }
}
