import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.services';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    console.log({ dto });
    return this.authService.signup();
  }

  @HttpCode(201)
  @Post('signin')
  signin() {
    return this.authService.login();
  }
}
