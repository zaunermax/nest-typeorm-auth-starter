import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../shared/Role';

@Entity()
export class User {
  constructor(data?: Omit<Partial<User>, 'id'>) {
    if (data) {
      if (data.role) this.role = data.role;
      if (data.name) this.name = data.name;
      if (data.pwHash) this.pwHash = data.pwHash;
    }
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column()
  pwHash!: string;

  @Column('enum', { enum: Role, default: Role.user })
  role!: Role;
}
