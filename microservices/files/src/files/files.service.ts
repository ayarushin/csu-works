import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Files } from './files.entity';
import { getConnection, Repository} from 'typeorm';
import { File, FileById, UpdateResponse } from './files.types';
import { from, mergeAll, Observable, switchMap } from 'rxjs';
import { isEmpty } from 'lodash';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files) private readonly repository: Repository<Files>,
  ) {}

  async create(body: File) {
    if (isEmpty(body)) {
      throw new BadRequestException('Bad data');
    }

    const user = await this.repository.findOne({ where: body });
    if (user) {
      throw new BadRequestException('File already exists');
    }

    return this.repository.save(body);
  }

  findAll() {
    return from(this.repository.find()).pipe(mergeAll());
  }

  findOneById({ id }: FileById) {
    return this.repository.findOne({where: { id }});
  }

  findFilesByUserId(param: Observable<FileById>) {
    return param.pipe(
      switchMap(({ id }) =>
        from(this.repository.find({ where: { createdBy: id } })),
      ),
      mergeAll(),
    );
  }

  async update({ id, file }: UpdateResponse) {
    if (isEmpty(file)) {
      throw new BadRequestException('Bad data');
    }

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { id: _id, ...newFile } = file;
      await this.repository.update(id, newFile);
      await queryRunner.commitTransaction();
      return this.findOneById({ id });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  delete({ id }: FileById) {
    return this.repository.delete({ id });
  }
}
