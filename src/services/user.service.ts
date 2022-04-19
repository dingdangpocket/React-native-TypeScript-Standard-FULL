/**
 * @file: user.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import { Store } from '@euler/model/entity';
import { Gender } from '@euler/model/enum';
import { UserInfo } from '@euler/model/UserInfo';
import { UserSessionProps } from '@euler/model/UserPresence';

export class UserService {
  constructor(private readonly api: HttpClient) {}

  async getVisibleStores(): Promise<Store[]> {
    return await this.api.get().url('/user/authorized-stores').future();
  }

  async getUserInfo(): Promise<UserInfo> {
    return await this.api.get().url('/user/profile').future();
  }

  async updateMobile(
    mobile: string,
    verifyCode: string,
    ticket: string,
  ): Promise<void> {
    await this.api
      .put()
      .url('/user/profile/mobile')
      .data({ mobile, verifyCode, ticket })
      .future();
  }

  async updateProfile(
    profile: {
      nick?: string | null;
      name?: string | null;
      avatar?: string | null;
      gender?: Gender | null;
      mobile?: string | null;
    },
    verifyCode?: string,
    ticket?: string,
  ): Promise<UserInfo> {
    return await this.api
      .patch()
      .url('/user/profile')
      .data({ ...profile, verifyCode, ticket })
      .future();
  }

  async presenceLogin(sessionProps: UserSessionProps) {
    return await this.api
      .post()
      .url('/user/presence/login')
      .data({ sessionProps })
      .future();
  }

  async presenceActive() {
    return await this.api.post().url('/user/presence/active').future();
  }

  async presenceLogout(uid: string) {
    return await this.api
      .post()
      .url('/user/presence/logout')
      .data({ uid })
      .future();
  }
}
