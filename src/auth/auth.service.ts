import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(body: CreateUserDto): Promise<any> {
    const hashedPass = await bcrypt.hash(
      body.password,
      +this.configService.get('CRYPT_SALT'),
    );
    const user = await this.userService.create({
      password: hashedPass,
      login: body.login,
    });
    const tokens = await this.getTokens(user);
    return { ...tokens, id: user.id };
  }

  async login(body): Promise<object> {
    return await this.getTokens(body.user);
  }

  async refresh(reqUser, token): Promise<any> {
    const user = await this.userService.findOne(reqUser);
    if (user.refreshToken !== token) {
      throw new ConflictException('Wrong refresh token');
    }
    return await this.getTokens(reqUser);
  }

  async refreshToken(login, token): Promise<any> {
    const user = await this.userService.findOneByLogin(login);
    await this.userService.updateToken(
      { id: user.id },
      { ...user, refreshToken: token },
    );
  }

  async getTokens(user): Promise<any> {
    const payload = {
      accessToken: this.jwtService.sign(
        { id: user.id, login: user.login },
        {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
        },
      ),
      refreshToken: this.jwtService.sign(
        {},
        {
          secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
          expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
        },
      ),
    };
    await this.refreshToken(user.login, payload.refreshToken);
    return payload;
  }
}
