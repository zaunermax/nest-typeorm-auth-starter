import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from 'nestjs-config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtToken } from '../../../types/shared/JwtToken';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret'),
    });
  }

  public async validate(payload: JwtToken) {
    return this.authService.validateTokenUser(payload.id);
  }
}
