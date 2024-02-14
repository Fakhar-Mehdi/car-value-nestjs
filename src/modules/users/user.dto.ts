import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { ROLES } from './user.entity';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  email: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;

  @ValidateIf(
    (object: any, value: any) =>
      value !== ROLES.ADMIN &&
      value !== ROLES.SUPER_ADMIN &&
      value !== ROLES.USER,
  )
  @MaxLength(0, {
    message: (args: ValidationArguments) => {
      return 'This role is not acceptable';
    },
  })
  role: string;
}

export class SignInUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;

  // @ValidateIf(
  //   (object: any, value: any) =>
  //     value !== ROLES.ADMIN &&
  //     value !== ROLES.SUPER_ADMIN &&
  //     value !== ROLES.USER,
  // )
  // @MaxLength(0, {
  //   message: (args: ValidationArguments) => {
  //     return 'This role is not acceptable';
  //   },
  // })
  // role: string;
}
