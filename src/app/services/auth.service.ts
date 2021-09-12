import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = environment.API_URL;
  userId: string | null = null;
  token: string | null = null;
  //
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  createUser(user: User) {
    return this.http.post(`${this.API_URL}user/signup`, user);
  }
  login(user: { email: string; password: string }) {
    return this.http
      .post<{ message: string; id?: string; token: string }>(
        `${this.API_URL}user/login`,
        {
          observe: 'response',
          user,
        }
      )
      .subscribe(
        (res) => {
          if (res.id) {
            this.userId = res.id;
          }
          this.token = res.token;
          this.authStatusListener.next(true);
          localStorage.setItem('token', res.token);
        },
        (err) => {
          console.log(err);
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
  isAuthenticated(): boolean {
    return !!this.token;
  }
  logout() {
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);

    localStorage.removeItem('token');
  }
}
