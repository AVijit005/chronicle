import { Global, Module } from '@nestjs/common';
import { SystemClock } from './clock';
import { UuidService } from './uuid';
import { NodeCryptoHashingService } from './hash';
import { RequestContextService } from './context';
import { LocalStorageService } from './storage';
import { InMemoryEventPublisher } from './events';

export const STORAGE_SERVICE = 'StorageService';
export const EVENT_PUBLISHER = 'EventPublisher';

@Global()
@Module({
  providers: [
    SystemClock,
    UuidService,
    NodeCryptoHashingService,
    RequestContextService,
    {
      provide: STORAGE_SERVICE,
      useClass: LocalStorageService,
    },
    {
      provide: EVENT_PUBLISHER,
      useClass: InMemoryEventPublisher,
    },
  ],
  exports: [
    SystemClock,
    UuidService,
    NodeCryptoHashingService,
    RequestContextService,
    STORAGE_SERVICE,
    EVENT_PUBLISHER,
  ],
})
export class CoreModule {}
