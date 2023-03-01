import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Something is incorrect');
    }
    const comparePasswords = await bcrypt.compare(password, user.password);
    if (!comparePasswords) {
      throw new UnauthorizedException('Something is incorrect');
    }
    return {
      user: user,
      id: user.id,
    };
  }
}
