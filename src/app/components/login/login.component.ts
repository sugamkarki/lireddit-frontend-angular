import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
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
