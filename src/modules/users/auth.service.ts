import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signup(email: string, password: string, role: string) {
    // see email is unique?
    const users = await this.userService.find(email);
    if (users.length) throw new BadRequestException('Email already registered');
    //hash the password

    //generate salt
    const salt = randomBytes(8).toString('hex');
    //hath the salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //join the hashed and salt together
    const result = salt + '.' + hash.toString('hex');

    //create new user and save it
    const user = await this.userService.create(email, result, role);
    //return user
    return user;
  }
  async signin(email: string, password: string) {
    // get the hashed password
    const [user] = await this.userService.find(email);
    if (!user) throw new NotFoundException('Email not registered');
    const [salt, hash] = user.password.split('.');

    let result = (await scrypt(password, salt, 32)) as Buffer;
    //   result= result.toString('hex')
    if (result.toString('hex') === hash)
      return {
        accessToken: this.jwtService.sign({ userId: user.id, role: user.role }),
      };
    throw new BadRequestException('Incorrect Email or Password');

    //seperate the hash password and get salt and hash1
    //hash the password again with the salt => hash2
    //compare hash1 and hash2
  }
}
