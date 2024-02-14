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

  create(email: string, password: string, role: string) {
    const user = this.repo.create({ email, password, role });
    console.log(`\n\Creating a new user with email: ${email}n`);
    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) return null;
    const user = await this.repo.findOneBy({ id });
    return user;
  }

  async find(email: string) {
    if (!email) throw new BadRequestException('please provide email');
    const users = await this.repo.find({ where: { email } });
    return users;
  }
  async update(id: number, userData: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not Found');
    Object.assign(user, userData);
    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not Found');
    return this.repo.remove(user);
  }
}
