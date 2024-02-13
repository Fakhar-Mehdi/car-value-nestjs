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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { emit } from 'process';

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
    );
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() userData: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(
      userData.email,
      userData.password,
    );
    session.userId = user.id;
    return user;
  }
  // @Get()
  // findAllUsers() {
  //   return this.userService.find(null)
  // }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
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
  findUser(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }
}
