import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../repositories/UserRepository';
import { AuthService } from '../auth/auth.service';
import { NewUser } from '../../types/dto/NewUser';
import { User } from '../../types/entities/User.entity';
import { Maybe } from '../../types/helpers';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOneOrFail(userId: number): Promise<User> {
    const user = await this.userRepo.findOne(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByName(userName: string): Promise<Maybe<User>> {
    return this.userRepo.findOne({ where: { name: userName } });
  }

  async addUser({ name, password }: NewUser): Promise<User> {
    const pwHash = await this.authService.createPwHash(password);
    this.logger.verbose(`PW Hash: ${pwHash}`);
    const user = new User({
      name,
      pwHash,
    });
    const [newUser] = await this.userRepo.save([user]);
    delete newUser.pwHash;
    return newUser;
  }

  async removeUser(id: number): Promise<User[]> {
    const user = await this.findOneOrFail(id);
    return this.userRepo.remove([user]);
  }
}
