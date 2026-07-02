import { IsOptional, IsString } from 'class-validator';

export class RefreshAccessTokenDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}
