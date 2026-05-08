import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EMPLOYEES } from '../employee/employee.data';

interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  type: 'Casual' | 'Sick' | 'Earned' | 'WFH';
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

@Component({
  selector: 'app-leave-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-tracker.html',
  styleUrl: './leave-tracker.css',
})
export class LeaveTrackerComponent implements OnInit {
  isAdmin = false;
  employeeId = '';
  employeeName = '';
  showForm = false;
  filterStatus = 'All';

  leaveBalance = { Casual: 12, Sick: 8, Earned: 15, WFH: 24 };
  used = { Casual: 0, Sick: 0, Earned: 0, WFH: 0 };

  newLeave: Partial<LeaveRequest> = {};
  allLeaves: LeaveRequest[] = [];

  ngOnInit() {
    const id = localStorage.getItem('loggedInEmployeeId');
    this.isAdmin = id === 'ADMIN' || !id;
    this.employeeId = id || 'ADMIN';
    const emp = EMPLOYEES.find(e => e.id === id);
    this.employeeName = emp?.name || 'Admin';

    const stored = localStorage.getItem('leave_requests');
    this.allLeaves = stored ? JSON.parse(stored) : this.seedLeaves();
    this.calcUsed();
  }

  seedLeaves(): LeaveRequest[] {
    return [
      { id: 1, employeeId: 'CBHYD628', employeeName: 'Pedakota Uday Kumar', type: 'Casual', from: '2025-04-10', to: '2025-04-11', days: 2, reason: 'Personal work', status: 'Approved', appliedOn: '2025-04-08' },
      { id: 2, employeeId: 'CBHYD604', employeeName: 'Vaddi Navya Sree', type: 'Sick', from: '2025-04-15', to: '2025-04-15', days: 1, reason: 'Fever', status: 'Approved', appliedOn: '2025-04-15' },
      { id: 3, employeeId: 'CBHYD605', employeeName: 'Yarlanki Siva Kumar', type: 'WFH', from: '2025-05-02', to: '2025-05-02', days: 1, reason: 'Home maintenance', status: 'Pending', appliedOn: '2025-04-30' },
      { id: 4, employeeId: 'CBHYD642', employeeName: 'Siddi Amulya', type: 'Earned', from: '2025-05-20', to: '2025-05-23', days: 4, reason: 'Family function', status: 'Pending', appliedOn: '2025-05-05' },
    ];
  }

  calcUsed() {
    this.used = { Casual: 0, Sick: 0, Earned: 0, WFH: 0 };
    const myLeaves = this.allLeaves.filter(l => l.employeeId === this.employeeId && l.status === 'Approved');
    for (const l of myLeaves) this.used[l.type] = (this.used[l.type] || 0) + l.days;
  }

  get myLeaves(): LeaveRequest[] {
    return this.allLeaves.filter(l => l.employeeId === this.employeeId);
  }

  get displayLeaves(): LeaveRequest[] {
    const list = this.isAdmin ? this.allLeaves : this.myLeaves;
    return this.filterStatus === 'All' ? list : list.filter(l => l.status === this.filterStatus);
  }

  get balanceCards() {
    return [
      { type: 'Casual', total: this.leaveBalance.Casual, used: this.used.Casual, color: '#6366f1', bg: '#eef2ff', icon: '🏖️' },
      { type: 'Sick',   total: this.leaveBalance.Sick,   used: this.used.Sick,   color: '#ef4444', bg: '#fef2f2', icon: '🤒' },
      { type: 'Earned', total: this.leaveBalance.Earned, used: this.used.Earned, color: '#10b981', bg: '#d1fae5', icon: '✈️' },
      { type: 'WFH',    total: this.leaveBalance.WFH,    used: this.used.WFH,    color: '#f59e0b', bg: '#fef3c7', icon: '🏠' },
    ];
  }

  calcDays() {
    if (this.newLeave.from && this.newLeave.to) {
      const diff = (new Date(this.newLeave.to).getTime() - new Date(this.newLeave.from).getTime()) / 86400000;
      this.newLeave.days = Math.max(1, diff + 1);
    }
  }

  openForm() {
    this.newLeave = { type: 'Casual', from: '', to: '', reason: '', days: 1 };
    this.showForm = true;
  }

  submitLeave() {
    if (!this.newLeave.from || !this.newLeave.to || !this.newLeave.reason) return;
    const req: LeaveRequest = {
      id: Date.now(), employeeId: this.employeeId, employeeName: this.employeeName,
      type: this.newLeave.type as LeaveRequest['type'],
      from: this.newLeave.from!, to: this.newLeave.to!,
      days: this.newLeave.days || 1, reason: this.newLeave.reason!,
      status: 'Pending', appliedOn: new Date().toISOString().slice(0, 10)
    };
    this.allLeaves = [req, ...this.allLeaves];
    localStorage.setItem('leave_requests', JSON.stringify(this.allLeaves));
    this.showForm = false;
  }

  updateStatus(id: number, status: 'Approved' | 'Rejected') {
    this.allLeaves = this.allLeaves.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem('leave_requests', JSON.stringify(this.allLeaves));
    this.calcUsed();
  }

  statusColor(s: string) { return { Approved: '#10b981', Rejected: '#ef4444', Pending: '#f59e0b' }[s] || '#94a3b8'; }
  statusBg(s: string)    { return { Approved: '#d1fae5', Rejected: '#fee2e2', Pending: '#fef3c7' }[s] || '#f1f5f9'; }
  typeColor(t: string)   { return { Casual: '#6366f1', Sick: '#ef4444', Earned: '#10b981', WFH: '#f59e0b' }[t] || '#6366f1'; }
  typeBg(t: string)      { return { Casual: '#eef2ff', Sick: '#fef2f2', Earned: '#d1fae5', WFH: '#fef3c7' }[t] || '#eef2ff'; }

  formatDate(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
}
