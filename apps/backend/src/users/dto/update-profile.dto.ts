import { IsOptional, IsString, Length, Matches, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  displayName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  location?: string;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null && v !== '')
  @IsString()
  @Matches(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i, {
    message: 'website must be a valid URL',
  })
  website?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z_]+(\/[A-Za-z_-]+)?$/, {
    message: 'timezone must be a valid IANA timezone',
  })
  timezone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z]{2}$/, { message: 'language must be a 2-letter ISO 639-1 code' })
  language?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(MM\/DD\/YYYY|DD\/MM\/YYYY|YYYY-MM-DD)$/, {
    message: 'dateFormat must be one of: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD',
  })
  dateFormat?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(light|dark|system)$/, {
    message: 'themePreference must be one of: light, dark, system',
  })
  themePreference?: string;

  @IsOptional()
  @ValidateIf((_o, v) => v !== null && v !== '')
  @IsString()
  @Matches(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i, {
    message: 'coverImage must be a valid URL',
  })
  coverImage?: string;
}
