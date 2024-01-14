import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // Save the new user in the db
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });

      // Return the saved user
      delete user.hash;
      return user;
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

    // Send back user
    delete user.hash;
    return user;
  }
}
