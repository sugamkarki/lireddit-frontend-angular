import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private authListenerSubscriber: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        // console.log(isAuthenticated);
        this.isAuthenticated = isAuthenticated;
      });
  }
  logout() {
    this.authService.logout();
  }
  ngOnInit(): void {}
}
