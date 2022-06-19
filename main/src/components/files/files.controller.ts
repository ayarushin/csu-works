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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { of, toArray } from 'rxjs';
import { FilesService, File } from './files.types';

@Controller('files')
@UseInterceptors(CacheInterceptor)
@ApiTags('Files')
export class FilesController implements OnModuleInit {
  private service: FilesService;

  constructor(@Inject('FILES_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<FilesService>('FilesService');
  }

  @Post()
  @ApiCreatedResponse({
    type: File,
    description: 'Create new file',
  })
  @ApiBadRequestResponse({ description: 'File already exists' })
  @ApiBody({ type: File, required: true })
  create(@Body() body: File) {
    return this.service.create(body);
  }

  @Get()
  @ApiOkResponse({
    type: [File],
    description: 'Get all files',
  })
  findAll() {
    return this.service.findAll().pipe(toArray());
  }

  @Get(':id')
  @ApiOkResponse({
    type: File,
    description: 'Get file by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a file that exists in the database',
    type: Number,
  })
  findOneById(@Param('id') id: number) {
    return this.service.findOneById({ id });
  }

  @Get('/user/:id')
  @ApiOkResponse({
    type: [File],
    description: 'Get all files by user id',
  })
  findUserFiles(@Param('id') id: number) {
    return this.service.findFilesByUserId(of({ id })).pipe(toArray());
  }

  @Patch(':id')
  @ApiOkResponse({
    type: File,
    description: 'Update file by id',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a file that exists in the database',
    type: Number,
  })
  @ApiBody({ type: File, required: true })
  updateOneById(@Param('id') id: number, @Body() updated: File) {
    return this.service.update({ id, file: updated });
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete file by id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a file that exists in the database',
    type: Number,
  })
  deleteById(@Param('id') id: number) {
    return this.service.delete({ id });
  }
}
