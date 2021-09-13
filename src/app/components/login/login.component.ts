import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private authStatusListenerSubscriber: Subscription;
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.titleService.setTitle('Login');
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    this.authStatusListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        if (authStatus) {
          this.toastr.success('Login Successful!!!', 'Success', {
            timeOut: 1000,
          });
        } else {
          // console.log(this.authService.getErrorMessage());
          this.loginForm.reset();
          this.toastr.error(
            `${this.authService.getErrorMessage()}!!!`,
            'Error',
            {
              timeOut: 1000,
            }
          );
        }
      });
  }
  ngOnInit(): void {}
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Enter the fields correctly!!!', 'Error');
      return;
    }
    this.authService.login(this.loginForm.value);
  }
}
