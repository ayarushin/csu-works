import { Observable } from 'rxjs';

export interface FileById {
  id: number;
}

export class File {
  id?: number;

  fileName: string;

  createdBy: number;

  createdAt?: Date;

  updatedAt?: Date;
}

export interface UpdateResponse {
  id: number;
  file: Partial<File>;
}

export interface FilesService {
  create(body: File): File;
  findAll(): Observable<File>;
  findOneById({ id }: FileById): File;
  update(body: UpdateResponse): File;
  delete({ id }: FileById): boolean;
}
