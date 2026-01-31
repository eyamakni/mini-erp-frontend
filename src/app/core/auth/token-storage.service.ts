import { Injectable } from '@angular/core';
import { AuthUser } from './auth.models';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';
const USER = 'authUser';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem(ACCESS, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH, refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS);
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH);
  }

  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER);
  }

  setUser(user: AuthUser) {
    localStorage.setItem(USER, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
