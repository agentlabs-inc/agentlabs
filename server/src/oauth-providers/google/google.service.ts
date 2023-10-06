import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  GoogleUserInfo,
  RefreshTokenResponse,
  TokenResponse,
  isGoogleUserInfo,
} from './types';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private readonly userInfoUrl =
    'https://www.googleapis.com/oauth2/v3/userinfo';

  private readonly httpClient = axios.create();

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
    try {
      const result = await this.httpClient.get<any>(this.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!isGoogleUserInfo(result.data)) {
        this.logger.error('Invalid google user info', result.data);
        return null;
      }
      return result.data;
    } catch (e) {
      this.logger.error('Error while getting google user info', e);
      return null;
    }
  }

  async refreshToken(params: {
    refreshToken: string;
    clientId: string;
    clientSecret: string;
  }): Promise<RefreshTokenResponse | null> {
    try {
      const { clientId, clientSecret, refreshToken } = params;
      const urlParams = new URLSearchParams();
      urlParams.append('refresh_token', refreshToken);
      urlParams.append('client_id', clientId);
      urlParams.append('client_secret', clientSecret);
      urlParams.append('grant_type', 'refresh_token');

      const res = await this.httpClient.post(
        'https://www.googleapis.com/oauth2/v3/token',
        urlParams,
      );

      return res.data as TokenResponse;
    } catch {
      return null;
    }
  }

  async getToken(params: {
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
  }): Promise<TokenResponse | null> {
    try {
      const { code, clientId, clientSecret, redirectUri } = params;
      const urlParams = new URLSearchParams();
      urlParams.append('code', code);
      urlParams.append('client_id', clientId);
      urlParams.append('client_secret', clientSecret);
      urlParams.append('grant_type', 'authorization_code');
      urlParams.append('redirect_uri', redirectUri);

      const res = await this.httpClient.post(
        'https://www.googleapis.com/oauth2/v3/token',
        urlParams,
      );

      return res.data as TokenResponse;
    } catch (e) {
      console.log('Response from Google:', e?.response?.data);
      return null;
    }
  }
}
