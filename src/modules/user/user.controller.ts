import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SetRoles } from '../../decorators/roles.decorator';
import { RoleGuard } from '../../guards/RoleGuard';
import { NewUser } from '../../types/dto/NewUser';
import { RemoveUser } from '../../types/dto/RemoveUser';
import { UserDto } from '../../types/dto/UserDto';
import { User } from '../../types/entities/User.entity';
import { Role } from '../../types/shared/Role';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @SetRoles(Role.admin)
  getUsers(): Promise<UserDto[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @SetRoles(Role.admin)
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findOneOrFail(id);
  }

  @Post()
  @SetRoles(Role.admin)
  addUser(@Body() body: NewUser): Promise<User> {
    return this.userService.addUser(body);
  }

  @Delete()
  @SetRoles(Role.admin)
  removeUser(@Body() body: RemoveUser) {
    return this.userService.removeUser(body.id);
  }
}
