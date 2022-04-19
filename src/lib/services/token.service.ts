import { config } from '@euler/config';
import base64 from 'base-64';
import { StorageService } from './storage.service';

/**
 * @class Auth token related service class.
 */
export class TokenService {
  private _token: string | null;

  constructor(private readonly storage: StorageService) {
    this.storage = storage;
    this._token = null;
  }

  getTokenStorageKey() {
    let env: string = config.environment;
    if (/prod/i.test(env)) env = '';
    return [env, '__authtoken__'].filter(x => x).join('.');
  }

  /**
   * Get the current user's token.
   * @returns {String | null} token
   */
  async getToken(): Promise<string | null> {
    if (this._token) return this._token;
    return await this.storage.get<string>(this.getTokenStorageKey());
  }

  /**
   * Set the new token for the given user.
   * @param {String} token the token to set for the user.
   */
  async setToken(token: string): Promise<void> {
    await this.storage.set(this.getTokenStorageKey(), token);
    this._token = token;
  }

  /**
   * Remove token.
   */
  async removeToken(): Promise<void> {
    await this.storage.remove(this.getTokenStorageKey());
    this._token = null;
  }

  /**
   * Decode the token payload.
   * @param token {string} decode the base64 encoded jwt token string.
   * @returns {any} token data.
   */
  decodeTokenPayload(token: string): any {
    const encodedData = token.replace('Bearer ', '').split('.')[1];
    const data = base64.decode(encodedData);
    return JSON.parse(data);
  }

  /**
   * Verify if the given token is valid.
   * @param token {string} the token to verify
   * @returns {boolean} true if valid otherwise false.
   */
  isValidToken(token: string): boolean {
    try {
      const payload = this.decodeTokenPayload(token);
      const expireTime = payload.exp * 1000;
      return Date.now() < expireTime;
    } catch (e) {
      /* noop */
    }
    return false;
  }

  /**
   * Get token expire time.
   * @returns {Date|Number} expire time.
   */
  async getTokenExpiry(): Promise<number | undefined> {
    const token = await this.getToken();
    if (!token) return;
    const payload = this.decodeTokenPayload(token);
    return payload.exp;
  }
}
