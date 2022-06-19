import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'files',
    protoPath: join(process.cwd(), '../../proto/files.proto'),
    url: `localhost:${process.env.PORT}`,
  },
};
