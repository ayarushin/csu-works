import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { BadRequestException } from '@nestjs/common';
import {
  createConnection,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Files } from './files.entity';
import { map, toArray } from 'rxjs';

describe('FilesService', () => {
  let service: FilesService;
  let repository: Repository<Files>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(Files),
          useClass: Repository,
        },
      ],
    }).compile();

    const connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Files],
      synchronize: true,
      logging: false,
    });

    repository = getRepository(Files);
    service = new FilesService(repository);

    return connection;
  });

  afterEach(async () => {
    await getConnection().close();
  });

  describe('create', () => {
    const body = {
      fileName: 'TestFileName',
      createdBy: 1,
    };

    it('should create a file', async () => {
      const { id, createdAt, updatedAt, ...file } = await service.create({
        ...body,
      });

      expect(createdAt).toBeDefined();
      expect(updatedAt).toBeDefined();
      expect(file).toEqual(body);
    });

    it('should throw existing error', async () => {
      await service.create({ ...body });

      await expect(service.create({ ...body })).rejects.toThrowError(
        new BadRequestException('File already exists'),
      );
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await repository.save([
        {
          fileName: 'TestFileName0',
          createdBy: 1,
        },
        {
          fileName: 'TestFileName1',
          createdBy: 2,
        },
        {
          fileName: 'TestFileName2',
          createdBy: 3,
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
        fileName: 'TestFileName',
        createdBy: 1,
      };
      const result = await service.create({ ...body });
      expect(await service.findOneById({ id: result.id })).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update entity correctly', async () => {
      const body = {
        fileName: 'TestFileName',
        createdBy: 1,
      };
      const result = await service.create({ ...body });
      const updatedResult = await service.update({
        id: result.id,
        file: { fileName: 'Updated FileName' },
      });
      expect(updatedResult).toEqual({
        ...result,
        fileName: 'Updated FileName',
      });
    });
  });

  describe('delete', () => {
    it('should delete entity by id', async () => {
      const body = {
        fileName: 'TestFileName',
        createdBy: 1,
      };
      const { id } = await service.create({ ...body });
      expect(await service.findOneById({ id })).toBeDefined();
      await service.delete({ id });
      expect(await service.findOneById({ id })).toBeUndefined();
    });
  });
});
