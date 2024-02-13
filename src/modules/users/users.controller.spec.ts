import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { NotFoundException } from '@nestjs/common';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let email = 'a@a.com';
  let password: any = 'helloPakistan';
  let _id = 1;
  beforeEach(async () => {
    fakeAuthService = {
      // signup: (email: string, password: string) => {},
      signin: (email, password) => {
        return Promise.resolve({ id: _id, email, password });
      },
    };
    fakeUserService = {
      // findOne: (id: number) => Promise.resolve({ id, email, password }),
      findOne: (id: number) => {
        return Promise.resolve({ id, email, password } as User);
      },
      find: (email: string) => Promise.resolve([{ id: _id, email, password }]),
      // remove: () => {},
      // update: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users - returns the list of users', async () => {
    const users = await controller.findAllUsers(email);
    expect(users[0].email).toBe(email);
  });

  it('fndUser returns a single user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toBe(1);
  });

  it('signs in and update the session object', async () => {
    const session: any = { userId: -10000 };
    const user = await controller.signin({ email, password }, session);
    expect(user.id).toBe(_id);
    expect(session.userId).toBe(_id);
  });
});
