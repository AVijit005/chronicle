import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { SharedModule } from '../shared';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { UploadService } from './upload.service';
import { ImageService } from './image.service';
import { ImageProcessorService } from './image-processor.service';
import { SignedUrlService } from './signed-url.service';
import { MediaCleanupService } from './media-cleanup.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [StorageController],
  providers: [
    StorageService,
    UploadService,
    ImageService,
    ImageProcessorService,
    SignedUrlService,
    MediaCleanupService,
  ],
  exports: [StorageService, UploadService, ImageService, ImageProcessorService],
})
export class StorageModule {}
