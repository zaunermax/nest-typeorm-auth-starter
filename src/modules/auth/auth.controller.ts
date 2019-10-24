import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReqWithUser } from '../../types/shared/ReqWithUser';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  public login(@Request() req: ReqWithUser): Promise<string> {
    return this.authService.createToken(req.user);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: ReqWithUser) {
    return req.user;
  }
}
