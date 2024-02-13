import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

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
}
