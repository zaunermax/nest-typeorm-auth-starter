import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/shared/Role';

export const SetRoles = (...roles: Role[]) => SetMetadata('roles', roles);
