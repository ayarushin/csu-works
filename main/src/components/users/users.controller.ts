import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { User, UsersService } from './users.types';
import { toArray } from 'rxjs';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@UseInterceptors(CacheInterceptor)
@ApiTags('Users')
export class UsersController implements OnModuleInit {
  private service: UsersService;

  constructor(@Inject('USERS_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<UsersService>('UsersService');
  }

  @Post()
  @ApiCreatedResponse({
    type: User,
    description: 'Create new user',
  })
  @ApiBadRequestResponse({ description: 'User already exists' })
  @ApiBody({ type: User, required: true })
  create(@Body() body: User) {
    return this.service.create(body);
  }

  @Get()
  @ApiOkResponse({
    type: [User],
    description: 'Get all users',
  })
  findAll() {
    return this.service.findAll().pipe(toArray());
  }

  @Get(':id')
  @ApiOkResponse({
    type: User,
    description: 'Get user by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  findOneById(@Param('id') id: number) {
    return this.service.findOneById({ id });
  }

  @Patch(':id')
  @ApiOkResponse({
    type: User,
    description: 'Update user by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  @ApiBody({ type: User, required: true })
  updateOneById(@Param('id') id: number, @Body() updated: User) {
    return this.service.update({ id, user: updated });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete user by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a user that exists in the database',
    type: Number,
  })
  deleteById(@Param('id') id: number) {
    return this.service.delete({ id });
  }
}
