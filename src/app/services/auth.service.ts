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
      .post<{ message: string; id: string; token: string }>(
        `${this.API_URL}user/login`,
        {
          observe: 'response',
          user,
        }
      )
      .subscribe(
        (res) => {
          this.userId = res.id;
          this.token = res.token;
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          localStorage.setItem('token', res.token);
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
    this.authStatusListener.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  getErrorMessage() {
    return this.errorMessage;
  }
}
