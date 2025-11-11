import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth/request/token')
  async getAuthtoken() {
    await this.authService.requestToken();
    return {
      data: {
        name: 'jmw93',
      },
    };
  }

  @Post('/auth/smartstore/token')
  requestSmartstoreToken() {
    return 'hello world';
  }
}
