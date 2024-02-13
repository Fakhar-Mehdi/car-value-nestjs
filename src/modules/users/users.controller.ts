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

@Controller('users')
// @Serialize(UserDto)
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

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return 'djksfhdskjfhdskh';
    return this.userService.findOne(parseInt(id));
  }

  // @Get('/whoami')
  // @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI() {
    console.log('in route user', 'user');
    return 'user';
  }

  @Get('/car')
  car() {
    console.log('hello');

    return 'car-value';
  }
  @Get()
  // @Redirect('https://docs.nestjs.com', 302)
  gets() {
    return 'car-value';
  }
  // @Get('b')
  // // @Redirect('https://docs.nestjs.com', 302)
  // getDocs() {
  //   return 'car-value';
  // }
  @Get('/b')
  // @Redirect('https://docs.nestjs.com', 302)
  getDoc() {
    return 'car-value';
  }
  // @Get('/b/')
  // // @Redirect('https://docs.nestjs.com', 302)
  // getDo() {
  //   return 'car-value';
  // }
  // @Get('b/')
  // // @Redirect('https://docs.nestjs.com', 302)
  // geto() {
  //   return 'car-value';
  // }
  // @Get()
  // @UseGuards(AuthGuard)
  // findAllUsers(@Query('email') email: string) {
  //   console.log('email', email);
  //   return this.userService.find(email);
  // }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }
}
