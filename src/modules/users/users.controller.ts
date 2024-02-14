import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  Delete,
  Session,
  UseGuards,
  Redirect,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import {
  CreateUserDto,
  SignInUserDto,
  UpdateUserDto,
  UserDto,
} from './user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ROLES, User } from './user.entity';
import { emit } from 'process';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() userData: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      userData.email,
      userData.password,
      userData.role,
    );
    return user;
  }

  @Post('signin')
  async signin(@Body() userData: SignInUserDto, @Session() session: any) {
    const { accessToken } = await this.authService.signin(
      userData.email,
      userData.password,
    );
    return accessToken;
  }
  // @Get()
  // findAllUsers() {
  //   return this.userService.find(null)
  // }

  // @Post('signout')
  // signOut(@Session() session: any) {
  //   session.userId = null;
  // }

  @Get('whoami')
  @UseGuards(new RoleGuard(ROLES.ADMIN))
  whoAmI(@CurrentUser() user: User) {
    return user ? user : 'Not Signed In';
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('User not Found');
    return user;
  }
}
