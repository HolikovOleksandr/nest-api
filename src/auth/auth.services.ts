import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // Save the new user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });

      return this.signToken(user.id, user.email);
      //
      //
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }

      throw error;
    }
  }

  async login(dto: AuthDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // If user does not exist throw exception
    if (!user) throw new ForbiddenException('Email incorrect');

    // Compare passwords
    const passMatches = await argon.verify(user.hash, dto.password);

    // If password incorrect throw exception
    if (!passMatches) throw new ForbiddenException('Password incorrect');

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: Number, email: string): Promise<Object> {
    const secret = this.config.get('JWT_SECRET');
    const payload = { sub: userId, email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return { accss_token: token };
  }
}
