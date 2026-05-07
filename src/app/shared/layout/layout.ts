import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EMPLOYEES, Employee } from '../../employee/employee.data';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent implements OnInit, OnDestroy {
  today = '';
  currentTime = '';
  private timer: any;

  loggedInEmployee: Employee | null = null;
  isAdmin = false;

  constructor(public router: Router) {}

  ngOnInit() {
    this.update();
    this.timer = setInterval(() => this.update(), 1000);
    this.loadEmployee();
  }

  ngOnDestroy() { clearInterval(this.timer); }

  update() {
    const now = new Date();
    this.today = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    this.currentTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  loadEmployee() {
    const id = localStorage.getItem('loggedInEmployeeId');
    if (id === 'ADMIN' || !id) {
      this.isAdmin = true;
    } else {
      this.loggedInEmployee = EMPLOYEES.find(e => e.id === id) || null;
    }
  }

  get displayName(): string {
    if (this.isAdmin) return 'Admin';
    const parts = this.loggedInEmployee?.name?.split(' ') || [];
    return parts[1] || parts[0] || 'User';
  }

  get displayInitials(): string {
    if (this.isAdmin) return 'A';
    const name = this.loggedInEmployee?.name || '';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U';
  }

  get displayAvatar(): string | null {
    return this.loggedInEmployee?.avatar || null;
  }

  goToProfile() {
    if (!this.isAdmin && this.loggedInEmployee) {
      this.router.navigate(['/my-profile']);
    }
  }

  logout() { 
    localStorage.removeItem('loggedInEmployeeId');
    this.router.navigate(['/login']); 
  }
}
