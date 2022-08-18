import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test123');
    expect(user.password).not.toEqual('test123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('test@test.com', 'test123');

    await expect(
      service.signup('test@test.com', 'test123'),
    ).rejects.toThrowError('email in use');
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('test@test.com', 'test')).rejects.toThrowError(
      'user not found',
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'test123');
    await expect(service.signin('test@test.com', 'pass')).rejects.toThrowError(
      'bad password',
    );
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'test');

    const user = await service.signin('test@test.com', 'test');
    expect(user).toBeDefined();
  });
});
