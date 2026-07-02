import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as nodePath from 'path';
import { StorageFile, StorageService } from './storage.abstraction';

@Injectable()
export class LocalStorageService implements StorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadRoot: string;

  constructor(configService: ConfigService) {
    const configured = configService.get<string>('storage.uploadRoot');
    this.uploadRoot = nodePath.resolve(configured ?? './uploads');
  }

  async upload(path: string, file: StorageFile): Promise<string> {
    const target = this.resolvePath(path);
    await fs.mkdir(nodePath.dirname(target), { recursive: true });
    await fs.writeFile(target, file.buffer);
    this.logger.debug(`Stored file at ${path} (${file.buffer.length} bytes)`);
    return path;
  }

  async download(path: string): Promise<Buffer> {
    return fs.readFile(this.resolvePath(path));
  }

  async delete(path: string): Promise<void> {
    try {
      await fs.unlink(this.resolvePath(path));
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        return;
      }
      throw error;
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(this.resolvePath(path));
      return true;
    } catch {
      return false;
    }
  }

  private resolvePath(relativePath: string): string {
    const normalized = nodePath.normalize(relativePath);
    if (nodePath.isAbsolute(normalized) || normalized.startsWith('..')) {
      throw new Error(`Invalid storage path: ${relativePath}`);
    }
    return nodePath.join(this.uploadRoot, normalized);
  }
}
