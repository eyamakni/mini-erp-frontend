import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginResponse } from './auth.models';
import { tap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private storage: TokenStorageService) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/login`, { email, password }).pipe(
      tap((res) => {
        this.storage.setTokens(res.accessToken, res.refreshToken);
        this.storage.setUser(res.user);
      }),
    );
  }

  me() {
    return this.http.get(`${this.base}/me`);
  }

  logout() {
    return this.http.post(`${this.base}/logout`, {}).pipe(
      tap(() => this.storage.clear()),
    );
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.base}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.base}/reset-password`, { token, newPassword });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post(`${this.base}/change-password`, { currentPassword, newPassword });
  }
}
