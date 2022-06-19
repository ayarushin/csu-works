import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import {
  createConnection,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { map, toArray } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    const connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Users],
      synchronize: true,
      logging: false,
    });

    repository = getRepository(Users);
    service = new UsersService(repository);

    return connection;
  });

  afterEach(async () => {
    await getConnection().close();
  });

  describe('create', () => {
    const body = {
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      email: 'test0@email.com',
      gender: 'Female',
      ipAddress: '127.0.0.1',
    };

    it('should create a user', async () => {
      const { id, ...user } = await service.create({ ...body });

      expect(user).toEqual(body);
    });

    it('should throw existing error', async () => {
      await service.create({ ...body });

      await expect(service.create({ ...body })).rejects.toThrowError(
        new BadRequestException('User already exists'),
      );
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await repository.save([
        {
          firstName: 'TestFirstName0',
          lastName: 'TestLastName0',
          email: 'test0@email.com',
          gender: 'Female',
          ipAddress: '127.0.0.1',
        },
        {
          firstName: 'TestFirstName1',
          lastName: 'TestLastName1',
          email: 'test1@email.com',
          gender: 'Female',
          ipAddress: '127.0.0.1',
        },
        {
          firstName: 'TestFirstName2',
          lastName: 'TestLastName2',
          email: 'test2@email.com',
          gender: 'Female',
          ipAddress: '127.0.0.1',
        },
      ]);
    });

    it('should return all entities', (done) => {
      service
        .findAll()
        .pipe(
          toArray(),
          map((result) => expect(result).toHaveLength(3)),
          map(() => done()),
        )
        .subscribe();
    });
  });

  describe('findOneById', () => {
    it('should return entity by id', async () => {
      const body = {
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        email: 'test0@email.com',
        gender: 'Female',
        ipAddress: '127.0.0.1',
      };
      const result = await service.create({ ...body });
      expect(await service.findOneById({ id: result.id })).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update entity correctly', async () => {
      const body = {
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        email: 'test0@email.com',
        gender: 'Female',
        ipAddress: '127.0.0.1',
      };
      const result = await service.create({ ...body });
      const updatedResult = await service.update({
        id: result.id,
        user: { firstName: 'Updated Name' },
      });
      expect(updatedResult).toEqual({ ...result, firstName: 'Updated Name' });
    });
  });

  describe('delete', () => {
    it('should delete entity by id', async () => {
      const body = {
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        email: 'test0@email.com',
        gender: 'Female',
        ipAddress: '127.0.0.1',
      };
      const { id } = await service.create({ ...body });
      expect(await service.findOneById({ id })).toEqual({ ...body, id });
      await service.delete({ id });
      expect(await service.findOneById({ id })).toBeUndefined();
    });
  });
});
