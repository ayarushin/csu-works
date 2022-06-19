import { Module } from '@nestjs/common';
import { TechniquesModule } from './techniques/techniques.module';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [TechniquesModule, ComponentsModule],
})
export class AppModule {}
