import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.services';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(201)
  @Post('signin')
  signin() {
    return this.authService.login();
  }
}
