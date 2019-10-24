import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from 'nestjs-config';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../../repositories/UserRepository';
import { User } from '../../types/entities/User.entity';
import { Nullable } from '../../types/helpers';
import { JwtToken } from '../../types/shared/JwtToken';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtSecret = configService.get('auth.secret');
  }

  async validateUser(username: string, pass: string): Promise<Nullable<User>> {
    const user = await this.userRepo.findOneByName(username);
    return user && (await bcrypt.compare(pass, user.pwHash)) ? user : null;
  }

  async validateTokenUser(userId: number): Promise<User> {
    const user = await this.userRepo.findOneOrFail(userId);
    delete user.pwHash;
    return user;
  }

  public createToken(user: User): Promise<string> {
    const payload: JwtToken = {
      name: user.name,
      role: user.role,
      id: user.id,
    };
    return this.jwtService.signAsync(payload);
  }

  public async createPwHash(password: string): Promise<string> {
    this.logger.verbose('Creating password hash');
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
