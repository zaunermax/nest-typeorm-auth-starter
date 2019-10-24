import { EntityRepository, Repository } from 'typeorm';
import { User } from '../types/entities/User.entity';
import { Maybe } from '../types/helpers';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findOneByName(name: string): Promise<Maybe<User>> {
    return this.findOne({ where: { name } });
  }
}
