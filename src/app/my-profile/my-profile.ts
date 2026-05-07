import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPLOYEES, Employee, WORK_STATUSES } from '../employee/employee.data';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfileComponent implements OnInit {
  employee: Employee | null = null;
  workStatus: any = null;
  isAdmin = false;

  ngOnInit() {
    const id = localStorage.getItem('loggedInEmployeeId');
    if (id === 'ADMIN' || !id) {
      this.isAdmin = true;
      return;
    }
    this.employee = EMPLOYEES.find(e => e.id === id) || null;
    this.workStatus = WORK_STATUSES.find(w => w.employeeId === id) || null;
  }

  get initials(): string {
    return this.employee?.name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'U';
  }

  get firstName(): string {
    const parts = this.employee?.name?.split(' ') || [];
    return parts[1] || parts[0] || '';
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      'In Progress': '#1a56db', 'Review': '#f59e0b',
      'Completed': '#10b981', 'On Hold': '#ef4444'
    };
    return map[status] || '#64748b';
  }

  priorityColor(p: string): string {
    return p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#10b981';
  }
}
