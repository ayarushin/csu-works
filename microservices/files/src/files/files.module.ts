import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Files } from './files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
