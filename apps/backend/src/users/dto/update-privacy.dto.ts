import { IsIn, IsOptional, IsString } from 'class-validator';

type VisibilityValue = 'public' | 'followers' | 'private';

export class UpdatePrivacyDto {
  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'private'])
  profileVisibility?: VisibilityValue;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'private'])
  collectionVisibility?: VisibilityValue;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'private'])
  journalVisibility?: VisibilityValue;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'private'])
  timelineVisibility?: VisibilityValue;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'private'])
  wrappedVisibility?: VisibilityValue;

  @IsOptional()
  @IsString()
  @IsIn(['public', 'followers', 'private'])
  searchVisibility?: VisibilityValue;
}
