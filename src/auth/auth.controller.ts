import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/auth/request/token')
  getAuthtoken() {
    return this.authService.requestToken();
  }
}
