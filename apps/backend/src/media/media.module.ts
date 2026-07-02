import { Module } from '@nestjs/common';
import { SharedModule } from '../shared';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { MediaMetadataService } from './media-metadata.service';
import { SlugService } from './slug.service';

@Module({
  imports: [SharedModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository, MediaMetadataService, SlugService],
  exports: [MediaService, MediaRepository, MediaMetadataService, SlugService],
})
export class MediaModule {}
