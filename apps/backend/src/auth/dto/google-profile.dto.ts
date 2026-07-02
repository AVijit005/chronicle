export class GoogleProfileDto {
  provider!: 'google';
  providerAccountId!: string;
  email!: string;
  emailVerified!: boolean;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  accessToken!: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt?: Date;
}
