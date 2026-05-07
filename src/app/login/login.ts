import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EMPLOYEES } from '../employee/employee.data';

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
    // Admin login
    if (this.username === 'admin@intellectinfo.com' && this.password === 'SysAdmin') {
      localStorage.setItem('loggedInEmployeeId', 'ADMIN');
      this.router.navigate(['/dashboard']);
      return;
    }

    // Employee login — match by email, password = Intellect@123
    const emp = EMPLOYEES.find(e => e.email.toLowerCase() === this.username.toLowerCase());
    if (emp && this.password === 'Intellect@123') {
      localStorage.setItem('loggedInEmployeeId', emp.id);
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMsg = 'Invalid email or password.';
    }
  }
}
