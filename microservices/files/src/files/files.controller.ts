import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { FilesService } from './files.service';
import { File, FileById, UpdateResponse } from './files.types';
import { Observable } from 'rxjs';

@Controller('files')
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @GrpcMethod('FilesService', 'Create')
  create(body: File) {
    return this.service.create(body);
  }

  @GrpcStreamMethod('FilesService', 'FindAll')
  findAll() {
    return this.service.findAll();
  }

  @GrpcMethod('FilesService', 'FindOneById')
  findOneById(data: FileById) {
    return this.service.findOneById(data);
  }

  @GrpcStreamMethod('FilesService', 'FindFilesByUserId')
  findUserFiles(data: Observable<FileById>) {
    return this.service.findFilesByUserId(data);
  }

  @GrpcMethod('FilesService', 'Update')
  update(body: UpdateResponse) {
    return this.service.update(body);
  }

  @GrpcMethod('FilesService', 'Delete')
  delete(data: FileById) {
    return this.service.delete(data);
  }
}
