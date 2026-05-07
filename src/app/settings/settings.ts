import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMPLOYEES, Employee } from '../employee/employee.data';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent implements OnInit {
  employee: Employee | null = null;
  isAdmin = false;

  displayName = '';
  email = '';
  theme: 'dark' | 'light' = 'dark';
  notifyBirthday = true;
  notifyHoliday = true;
  notifyProject = false;
  saved = false;

  ngOnInit() {
    const id = localStorage.getItem('loggedInEmployeeId');
    if (id === 'ADMIN' || !id) {
      this.isAdmin = true;
      this.displayName = 'Admin';
      this.email = 'admin@intellectinfo.com';
    } else {
      this.employee = EMPLOYEES.find(e => e.id === id) || null;
      this.displayName = this.employee?.name || '';
      this.email = this.employee?.email || '';
    }
    this.theme = (localStorage.getItem('app_theme') as 'dark' | 'light') || 'dark';
    this.notifyBirthday = localStorage.getItem('notify_birthday') !== 'false';
    this.notifyHoliday = localStorage.getItem('notify_holiday') !== 'false';
    this.notifyProject = localStorage.getItem('notify_project') === 'true';
  }

  applyTheme(t: 'dark' | 'light') {
    this.theme = t;
    document.body.classList.toggle('theme-light', t === 'light');
  }

  saveSettings() {
    localStorage.setItem('app_theme', this.theme);
    localStorage.setItem('notify_birthday', String(this.notifyBirthday));
    localStorage.setItem('notify_holiday', String(this.notifyHoliday));
    localStorage.setItem('notify_project', String(this.notifyProject));
    this.applyTheme(this.theme);
    this.saved = true;
    setTimeout(() => this.saved = false, 2500);
  }
}
