import { Global, Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { CoreModule } from '../core';

@Global()
@Module({
  imports: [CommonModule, CoreModule],
  exports: [CommonModule, CoreModule],
})
export class SharedModule {}
