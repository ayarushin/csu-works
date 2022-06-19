import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'users',
    protoPath: join(process.cwd(), '../../proto/users.proto'),
    url: `localhost:${process.env.PORT}`,
  },
};
