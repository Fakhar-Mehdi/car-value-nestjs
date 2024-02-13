import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    console.log(`\n\Creating a new user with email: ${email}n`);
    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) return null;
    const user = await this.repo.findOneBy({ id });
    if (!user)
      throw new NotFoundException(`User not found. No user has this id: ${id}`);
    return user;
  }

  async find(email: string) {
    if (!email) throw new BadRequestException('please provide email');
    const users = await this.repo.find({ where: { email } });
    // if (!users || !users.length)
    //   throw new NotFoundException(
    //     `Users not found. No user has this email: ${email}`,
    //   );
    return users;
  }
  async update(id: number, userData: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, userData);
    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove(user);
  }
}
