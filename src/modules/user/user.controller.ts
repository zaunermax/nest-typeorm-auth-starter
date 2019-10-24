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
import { User } from '../../types/entities/User.entity';
import { Role } from '../../types/shared/Role';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Promise<User> {
    return this.userService.findOneOrFail(id);
  }

  @Post()
  @SetRoles(Role.admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  addUser(@Body() body: NewUser): Promise<User> {
    return this.userService.addUser(body);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  removeUser(@Body() body: RemoveUser) {
    return this.userService.removeUser(body.id);
  }
}
