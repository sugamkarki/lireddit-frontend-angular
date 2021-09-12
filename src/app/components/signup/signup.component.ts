import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.titleService.setTitle('Signup');
    this.signupForm = new FormGroup({
      first_name: new FormControl('', []),
      last_name: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {}
  onSubmit() {
    if (this.signupForm.invalid) {
      this.toastr.error('Please fill out the forms Properly', 'Error');
      return;
    } else if (
      this.signupForm.value.password !== this.signupForm.value.password2
    ) {
      this.toastr.error("Passwords Don't match!!!", 'Error');
      return;
    }
    const userData: User = {
      first_name: this.signupForm.value.first_name,
      email: this.signupForm.value.email,
      last_name: this.signupForm.value.last_name,
      password: this.signupForm.value.password,
    };
    this.authService.createUser(userData).subscribe((response) => {
      console.log(response);
    });
  }
}
