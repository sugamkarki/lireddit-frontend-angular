import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;
  private userId: string | null = null;
  private token: string | null = null;
  private errorMessage: string = '';
  private tokenTimer: any;
  //
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  constructor(private http: HttpClient, private router: Router) {}
  createUser(user: User) {
    this.http
      .post<{ message: string; user: User; token: string; id: string }>(
        `${this.API_URL}user/signup`,
        {
          observe: 'response',
          user,
        }
      )
      .subscribe(
        (res) => {
          this.token = res.token;
          this.authStatusListener.next(true);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.authStatusListener.next(false);
        }
      );
  }
  login(user: { email: string; password: string }) {
    return this.http
      .post<{ message: string; id: string; token: string; expiresIn: number }>(
        `${this.API_URL}user/login`,
        {
          observe: 'response',
          user,
        }
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.userId = res.id;
          this.token = res.token;
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          console.log(now.getTime() + expiresInDuration * 1000);
          this.setAuthData(this.token, expirationDate, this.userId);
          this.router.navigate(['/']);
        },
        (err) => {
          this.errorMessage = err.error.message;
          this.authStatusListener.next(false);
        }
      );
  }
  getUserId(): string | null {
    return this.userId;
  }
  getToken(): string | null {
    return this.token;
  }
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }
  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
  logout() {
    this.token = null;
    this.userId = null;
    this.errorMessage = "You've Logged out";
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.removeAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }
  getErrorMessage() {
    return this.errorMessage;
  }
  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expiry.getTime() - now.getTime();
    this.userId = authInfo.userId;
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  getAuthData() {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    const userId = localStorage.getItem('userId');
    if (!token || !expiry || !userId) {
      return;
    }
    return {
      token,
      expiry: new Date(expiry),
      userId,
    };
  }
  removeAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
    localStorage.removeItem('userId');
  }
  setAuthData(token: string, expiry: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiry', expiry.toISOString());
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
