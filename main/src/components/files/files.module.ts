import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'FILES_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'files',
            protoPath: join(process.cwd(), '../proto/files.proto'),
            url: configService.get('FILES_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [FilesController],
})
export class FilesModule {}
