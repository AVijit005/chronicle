import { Module } from '@nestjs/common';
import { DeploymentHealthService } from './deployment-health.service';
import { EnvironmentValidationService } from './environment-validation.service';
import { ReleaseValidationService } from './release-validation.service';
import { BackupService } from './backup.service';
import { RestoreService } from './restore.service';
import { ProductionConfigurationService } from './production-configuration.service';

@Module({
  providers: [
    DeploymentHealthService,
    EnvironmentValidationService,
    ReleaseValidationService,
    BackupService,
    RestoreService,
    ProductionConfigurationService,
  ],
  exports: [
    DeploymentHealthService,
    EnvironmentValidationService,
    ReleaseValidationService,
    BackupService,
    RestoreService,
    ProductionConfigurationService,
  ],
})
export class DeploymentModule {}
