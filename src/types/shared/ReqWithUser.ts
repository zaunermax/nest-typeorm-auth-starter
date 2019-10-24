import { Request } from 'express';
import { User } from '../entities/User.entity';

export interface ReqWithUser extends Request {
  user: User;
}
