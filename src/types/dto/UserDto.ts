import { User } from '../entities/User.entity';

export type UserDto = Omit<User, 'pwHash'>;
