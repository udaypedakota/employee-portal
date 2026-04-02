import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
})
export class MainDashboard {
  state: string;
  dccb: string;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    const s = nav?.extras?.state ?? history.state;
    this.state = s['state'] || '';
    this.dccb = s['dccb'] || '';
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
