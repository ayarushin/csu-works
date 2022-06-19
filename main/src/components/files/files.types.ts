import { Observable } from 'rxjs';
import { ApiProperty } from '@nestjs/swagger';

export interface FileById {
  id: number;
}

export class File {
  @ApiProperty({
    type: Number,
    description: 'File id, primary key, auto generate on creating',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'File name',
  })
  fileName: string;

  @ApiProperty({
    type: Number,
    description: 'User id, who created this file',
  })
  createdBy: number;

  @ApiProperty({
    type: Date,
    description: 'Created date',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Updated date',
  })
  updatedAt: Date;
}

export interface UpdateResponse {
  id: number;
  file: Partial<File>;
}

export interface FilesService {
  create(body: File): File;
  findAll(): Observable<File>;
  findOneById({ id }: FileById): File;
  findFilesByUserId(param: Observable<FileById>): Observable<File>;
  update(body: UpdateResponse): File;
  delete({ id }: FileById): boolean;
}
