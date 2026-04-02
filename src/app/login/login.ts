import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  errorMsg = '';
  showPassword = false;

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin@intellectinfo.com' && this.password === 'SysAdmin') {
      localStorage.setItem('loggedInUser', 'Admin');
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMsg = 'Invalid username or password.';
    }
  }
}
