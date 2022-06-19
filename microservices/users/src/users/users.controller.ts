import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateResponse, User, UserById } from './users.types';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @GrpcMethod('UsersService', 'Create')
  create(body: User) {
    return this.service.create(body);
  }

  @GrpcStreamMethod('UsersService', 'FindAll')
  findAll() {
    return this.service.findAll();
  }

  @GrpcMethod('UsersService', 'FindOneById')
  findOneById(data: UserById) {
    return this.service.findOneById(data);
  }

  @GrpcMethod('UsersService', 'Update')
  update(body: UpdateResponse) {
    return this.service.update(body);
  }

  @GrpcMethod('UsersService', 'Delete')
  delete(data: UserById) {
    return this.service.delete(data);
  }
}
