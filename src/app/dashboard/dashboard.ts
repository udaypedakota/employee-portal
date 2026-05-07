import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee } from '../employee/employee.data';
import { EmployeeService } from '../employee/employee.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  constructor(public router: Router, private employeeService: EmployeeService) { }

  get greeting() {
    const h = new Date().getHours();
    const time = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    const id = localStorage.getItem('loggedInEmployeeId');
    let name = 'Admin';
    if (id && id !== 'ADMIN') {
      const emp = this.employeeService.getAll().find(e => e.id === id);
      if (emp) {
        const parts = emp.name.split(' ');
        name = parts[1] || parts[0];
      }
    }
    return `${time}, ${name}`;
  }

  stats: { label: string; value: number; icon: string; color: string; bg: string }[] = [];
  teams: { role: string; count: number; icon: string; color: string; employees: Employee[] }[] = [];

  ngOnInit() {
    this.refreshTeams();
  }

  refreshTeams() {
    const all = this.employeeService.getAll();
    const fullStack = all.filter(e => e.role === 'Full-stack Developer');
    const testers = all.filter(e => e.role === 'Tester');
    const uiDevs = all.filter(e => e.role === 'UI Developer');
    const designers = all.filter(e => e.role === 'UI/UX Designer');
    const network = all.filter(e => e.role === 'Network');

    this.stats = [
      { label: 'Total Members', value: all.length, icon: '👥', color: '#0055a5', bg: '#e8f1fb' },
      { label: 'Full Stack Devs', value: fullStack.length, icon: '💻', color: '#00897b', bg: '#e0f5f2' },
      { label: 'Testers', value: testers.length, icon: '🧪', color: '#f57c00', bg: '#fff3e0' },
      { label: 'UX / UI Design', value: designers.length, icon: '🎨', color: '#8e24aa', bg: '#f3e5f5' },
      { label: 'UI Developers', value: uiDevs.length, icon: '🖥️', color: '#e53935', bg: '#fce4ec' },
      { label: 'Network / DevOps', value: network.length, icon: '🌐', color: '#00695c', bg: '#e0f2f1' },
    ];

    this.teams = [
      { role: 'Full Stack Developers', icon: '💻', color: '#0055a5', count: fullStack.length, employees: fullStack },
      { role: 'Testers', icon: '🧪', color: '#f57c00', count: testers.length, employees: testers },
      { role: 'UX / UI Designers', icon: '🎨', color: '#8e24aa', count: designers.length, employees: designers },
      { role: 'UI Developers', icon: '🖥️', color: '#e53935', count: uiDevs.length, employees: uiDevs },
      { role: 'Network / DevOps', icon: '🌐', color: '#00695c', count: network.length, employees: network },
    ];
  }

  activeTeam: string | null = null;
  selectedTeam: typeof this.teams[0] | null = null;

  selectSegment(team: typeof this.teams[0]) {
    this.selectedTeam = this.selectedTeam?.role === team.role ? null : team;
  }

  showAddModal = false;
  newEmployee: Partial<Employee> = {};

  openAddModal() { this.newEmployee = {}; this.showAddModal = true; }
  closeAddModal() { this.showAddModal = false; }

  onPhotoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.newEmployee.avatar = reader.result as string;
    reader.readAsDataURL(file);
  }

  addEmployee() {
    const e = this.newEmployee;
    if (!e.id || !e.name || !e.role || !e.department || !e.email) return;
    this.employeeService.add(e as Employee).subscribe(() => {
      this.refreshTeams();
      this.closeAddModal();
    });
  }

  showDeleteModal = false;
  deleteTargetId = '';
  deleteTargetName = '';

  deleteEmployee(id: string) {
    const emp = this.employeeService.getAll().find(e => e.id === id);
    this.deleteTargetId = id;
    this.deleteTargetName = emp?.name || id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.employeeService.delete(this.deleteTargetId).subscribe(() => {
      this.refreshTeams();
      this.showDeleteModal = false;
    });
  }

  viewEmployee(id: string) {
    this.router.navigate(['/employee', id]);
  }

  toggleTeam(role: string) {
    this.activeTeam = this.activeTeam === role ? null : role;
  }
}
