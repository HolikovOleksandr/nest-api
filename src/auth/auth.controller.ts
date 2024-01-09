import { Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('signup')
  signup() {
    return this.authService.signup();
  }

  @HttpCode(201)
  @Post('signin')
  signin() {
    return this.authService.login();
  }
}
