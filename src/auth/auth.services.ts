import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(): Object {
    return { msg: 'Hello signin' };
  }

  signup(): Object {
    return { msg: 'Hello signup' };
  }
}
