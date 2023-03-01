import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { Public } from '../common/decorators/public.decorator';

@Public()
@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards()
  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<any> {
    return this.authService.signup(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() body: CreateUserDto, @Req() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Body() body: RefreshTokenDto, @Req() req): Promise<any> {
    return this.authService.refresh(req.user, body.refreshToken);
  }
}
