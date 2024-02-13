import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;
  let email = 'a@a.com';
  let password: any = 'helloPakistan';
  let salt: any = randomBytes(8).toString('hex');
  let hash, result, user;

  beforeEach(async () => {
    hash = (await scrypt(password, salt, 32)) as Buffer;
    result = salt + '.' + hash.toString('hex');
    user = { id: 1, email, password: result };

    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password }),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('creates user with salted and hashed password', async () => {
    const user = await service.signup(email, password);
    expect(user.email).toBe(email);
    expect(user.password).not.toBe(password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user signs up with email that is in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' }]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an un-registered email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
  it('throws bad request exception for an invalid password', async () => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email, password: result }]);
    await expect(service.signin(email, 'password')).rejects.toThrow(
      BadRequestException,
    );
  });
  it('should sign in', async () => {
    fakeUserService.find = () => Promise.resolve([user]);
    const signedIn = await service.signin(email, password);
    expect(signedIn).toBe(user);
  });
});
