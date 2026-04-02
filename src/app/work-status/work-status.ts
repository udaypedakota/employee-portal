import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMPLOYEES, WORK_STATUSES, WorkStatus } from '../employee/employee.data';

@Component({
  selector: 'app-work-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-status.html',
  styleUrl: './work-status.css'
})
export class WorkStatusComponent {
  constructor(private router: Router) {}

  filterStatus = 'All';
  filterProject = 'All';
  searchQuery = '';

  statuses = ['All', 'In Progress', 'Review', 'Completed', 'On Hold'];

  projects = ['All', ...Array.from(new Set(WORK_STATUSES.map(w => w.project))).sort()];

  get rows() {
    return WORK_STATUSES
      .filter(w => {
        const emp = EMPLOYEES.find(e => e.id === w.employeeId);
        const matchStatus = this.filterStatus === 'All' || w.status === this.filterStatus;
        const matchProject = this.filterProject === 'All' || w.project === this.filterProject;
        const matchSearch = !this.searchQuery ||
          emp?.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          w.project.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          w.task.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchStatus && matchProject && matchSearch;
      })
      .map(w => ({ ...w, employee: EMPLOYEES.find(e => e.id === w.employeeId) }));
  }

  get summary() {
    return {
      total: WORK_STATUSES.length,
      inProgress: WORK_STATUSES.filter(w => w.status === 'In Progress').length,
      review: WORK_STATUSES.filter(w => w.status === 'Review').length,
      completed: WORK_STATUSES.filter(w => w.status === 'Completed').length,
      onHold: WORK_STATUSES.filter(w => w.status === 'On Hold').length,
    };
  }

  statusColor(status: string) {
    return { 'In Progress': '#0055a5', 'Review': '#f57c00', 'Completed': '#00897b', 'On Hold': '#e53935' }[status] ?? '#94a3b8';
  }

  priorityColor(p: string) {
    return { High: '#e53935', Medium: '#f57c00', Low: '#00897b' }[p] ?? '#94a3b8';
  }

  viewEmployee(id: string) { this.router.navigate(['/employee', id]); }
  goBack() { this.router.navigate(['/dashboard']); }

  editRow: string | null = null;
  editData: Partial<WorkStatus> = {};

  startEdit(emp: any, event: Event) {
    event.stopPropagation();
    const original = WORK_STATUSES.find(w => w.employeeId === emp.employeeId);
    if (!original) return;
    this.editRow = emp.employeeId;
    this.editData = { ...original };
  }

  saveEdit() {
    const idx = WORK_STATUSES.findIndex(w => w.employeeId === this.editRow);
    if (idx > -1) Object.assign(WORK_STATUSES[idx], this.editData);
    this.editRow = null;
  }

  cancelEdit() { this.editRow = null; }

  get editEmployee() {
    return EMPLOYEES.find(e => e.id === this.editRow);
  }
}
