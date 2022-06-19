import { Observable } from 'rxjs';

export interface UserById {
  id: number;
}

export class User {
  id?: number;

  firstName: string;

  lastName: string;

  email: string;

  gender: string;

  ipAddress: string;
}

export interface UpdateResponse {
  id: number;
  user: Partial<User>;
}

export interface UsersService {
  create(body: User): User;
  findAll(): Observable<User>;
  findOneById({ id }: UserById): User;
  update(body: UpdateResponse): User;
  delete({ id }: UserById): boolean;
}
