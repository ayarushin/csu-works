import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { getConnection, Repository } from 'typeorm';
import { UpdateResponse, User, UserById } from './users.types';
import { from, mergeAll } from 'rxjs';
import { isEmpty } from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly repository: Repository<Users>,
  ) {}

  async create(body: User) {
    if (isEmpty(body)) {
      throw new BadRequestException('Bad data');
    }

    const user = await this.repository.findOne({ where: body });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return this.repository.save(body);
  }

  findAll() {
    return from(this.repository.find()).pipe(mergeAll());
  }

  findOneById({ id }: UserById) {
    return this.repository.findOne({ where: { id } });
  }

  async update({ id, user }: UpdateResponse) {
    if (isEmpty(user)) {
      throw new BadRequestException('Bad data');
    }

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { id: _id, ...newUser } = user;
      await this.repository.update(id, newUser);
      await queryRunner.commitTransaction();
      return this.findOneById({ id });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }

  delete({ id }: UserById) {
    return this.repository.delete({ id });
  }
}
