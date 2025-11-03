import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { RegisterUseCase } from '../../src/application/use-cases/auth/register.use-case';
import { UserEntity } from '../../src/infrastructure/database/entities/user.typeorm-entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUseCase,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<RegisterUseCase>(RegisterUseCase);
  });

  it('should register a new user successfully', async () => {
    const registerDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    mockUserRepository.findOne.mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    
    const mockUser = {
      id: '1',
      ...registerDto,
      password: 'hashedPassword',
      role: 'player',
    };
    
    mockUserRepository.create.mockReturnValue(mockUser);
    mockUserRepository.save.mockResolvedValue(mockUser);

    const result = await useCase.execute(registerDto);

    expect(result).toBeDefined();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: [
        { username: registerDto.username },
        { email: registerDto.email },
      ],
    });
  });

  it('should throw ConflictException if username already exists', async () => {
    const registerDto = {
      username: 'existinguser',
      email: 'new@example.com',
      password: 'password123',
    };

    mockUserRepository.findOne.mockResolvedValue({ id: '1', username: 'existinguser' });

    await expect(useCase.execute(registerDto)).rejects.toThrow(ConflictException);
  });
});
