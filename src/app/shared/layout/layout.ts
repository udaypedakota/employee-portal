import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EMPLOYEES, Employee } from '../../employee/employee.data';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule],
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
    const theme = localStorage.getItem('app_theme');
    document.body.classList.toggle('theme-light', theme === 'light');
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

  sidebarOpen = false;
  messagesOpen = false;
  notificationsOpen = false;

  messages = [
    { initials: 'BK', name: 'Balakrishna', text: 'Please update your timesheet.', time: '9:30 am', color: '#6366f1' },
    { initials: 'NK', name: 'Navya Sree', text: 'DCT module review done ✅', time: 'Yesterday', color: '#10b981' },
    { initials: 'SK', name: 'Siva Kumar', text: 'Can you join the standup?', time: 'Mon', color: '#f59e0b' },
  ];

  notifications = [
    { icon: '🎂', bg: '#fef3c7', title: 'Birthday Today!', sub: 'Wish your teammate a happy birthday', time: 'Now' },
    { icon: '🗓️', bg: '#eff6ff', title: 'Holiday Tomorrow', sub: 'Office closed — check holiday calendar', time: '1h ago' },
    { icon: '📋', bg: '#f0fdf4', title: 'Project Update', sub: 'DCT migration task marked complete', time: '3h ago' },
    { icon: '👤', bg: '#f5f3ff', title: 'New Employee Added', sub: 'Sai Teja joined UI Development', time: 'Yesterday' },
  ];

  toggleMessages(e: MouseEvent) {
    e.stopPropagation();
    this.notificationsOpen = false;
    this.messagesOpen = !this.messagesOpen;
  }

  toggleNotifications(e: MouseEvent) {
    e.stopPropagation();
    this.messagesOpen = false;
    this.notificationsOpen = !this.notificationsOpen;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.messagesOpen = false;
    this.notificationsOpen = false;
  }

  logout() { 
    localStorage.removeItem('loggedInEmployeeId');
    this.router.navigate(['/login']); 
  }
}
