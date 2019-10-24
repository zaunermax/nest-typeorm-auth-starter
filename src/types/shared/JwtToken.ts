import { Role } from './Role';

export interface JwtToken {
  name: string;
  role: Role;
  id: number;
}
