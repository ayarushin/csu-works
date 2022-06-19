import { Observable } from 'rxjs';
import { ApiProperty } from '@nestjs/swagger';

export interface UserById {
  id: number;
}

export class User {
  @ApiProperty({
    type: Number,
    description: 'User id, primary key, auto generate on creating',
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'User first name',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'User last name',
  })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'User gender',
  })
  gender: string;

  @ApiProperty({
    type: String,
    description: 'User ip address',
  })
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
