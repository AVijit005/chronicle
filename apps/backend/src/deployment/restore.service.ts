import { Injectable, Logger } from '@nestjs/common';
import { execSync } from 'child_process';
import * as fs from 'fs';

export interface RestoreResult {
  success: boolean;
  error?: string;
}

@Injectable()
export class RestoreService {
  private readonly logger = new Logger(RestoreService.name);

  async restoreDatabase(dumpFile: string): Promise<RestoreResult> {
    try {
      if (!fs.existsSync(dumpFile)) throw new Error(`Dump file not found: ${dumpFile}`);

      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) throw new Error('DATABASE_URL not set');

      execSync(`psql "${databaseUrl}" < "${dumpFile}"`, { timeout: 600000 });
      this.logger.log(`Database restored from: ${dumpFile}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Database restore failed: ${error}`);
      return { success: false, error: (error as Error).message };
    }
  }

  async restoreMedia(archiveFile: string): Promise<RestoreResult> {
    try {
      if (!fs.existsSync(archiveFile)) throw new Error(`Archive not found: ${archiveFile}`);

      const uploadRoot = process.env.UPLOAD_ROOT || './uploads';
      execSync(`tar -xzf "${archiveFile}" -C "${uploadRoot}"`, { timeout: 300000 });
      this.logger.log(`Media restored from: ${archiveFile}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Media restore failed: ${error}`);
      return { success: false, error: (error as Error).message };
    }
  }
}
