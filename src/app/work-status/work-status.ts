import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PROJECT_ALLOCATIONS, ProjectAllocation } from './project-allocation.data';
import { EMPLOYEES } from '../employee/employee.data';

@Component({
  selector: 'app-work-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-status.html',
  styleUrl: './work-status.css'
})
export class WorkStatusComponent {
  searchQuery = '';
  filterProject = 'All';
  filterRole = 'All';

  projects = ['All', ...Array.from(new Set(PROJECT_ALLOCATIONS.map(p => p.project.split(' - ')[0]))).sort()];
  roles = ['All', ...Array.from(new Set(PROJECT_ALLOCATIONS.map(p => p.role))).sort()];

  constructor(private router: Router) {}

  get filtered(): ProjectAllocation[] {
    return PROJECT_ALLOCATIONS.filter(a => {
      const matchSearch = !this.searchQuery ||
        a.employeeName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        a.project.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchProject = this.filterProject === 'All' || a.project.startsWith(this.filterProject);
      const matchRole = this.filterRole === 'All' || a.role === this.filterRole;
      return matchSearch && matchProject && matchRole;
    });
  }

  getEmployee(id: string) {
    return EMPLOYEES.find(e => e.id === id);
  }

  getInitials(name: string) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getDuration(start: string, end: string) {
    const s = new Date(start), e = new Date(end);
    const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    return months + ' months';
  }

  isActive(end: string) {
    return new Date(end) >= new Date();
  }

  viewEmployee(id: string) { this.router.navigate(['/employee', id]); }
}
