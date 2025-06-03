import { Controller, Post, Req, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/check_user_register')
  async login(@Body() body: { email: string; password: string }, @Req() req: Request) {
    return this.authService.validateAndLogUser(body.email, body.password, req);
  }
}
