import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Employee } from '../employee/employee.data';
import { EmployeeService } from '../employee/employee.service';
import { BirthdayFundService } from '../birthday-tracker/birthday-fund.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  constructor(public router: Router, private employeeService: EmployeeService, private birthdaySvc: BirthdayFundService) { }

  get greeting() {
    const h = new Date().getHours();
    const name = localStorage.getItem('loggedInUser') || 'Admin';
    const time = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    return `${time}, ${name}`;
  }

  today = '';
  currentTime = '';
  private timer: any;

  // ── Birthday notification ──
  todayBirthdays: { name: string; role: string; department: string; avatar?: string; gender?: string; id: string }[] = [];
  confettiItems = Array.from({ length: 30 }, (_, i) => i);

  loadTodayBirthdays() {
    const today = new Date();
    const todayMMDD = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const employees = this.employeeService.getAll();
    this.birthdaySvc.seedEvents().subscribe(events => {
      this.todayBirthdays = events
        .filter(e => (e.birthDate || '').slice(5) === todayMMDD)
        .map(e => {
          const emp = employees.find(x => x.id === e.employeeId);
          return { id: e.employeeId, name: e.employeeName, role: emp?.role || '', department: emp?.department || '', avatar: emp?.avatar, gender: emp?.gender };
        });
    });
  }

  fullStackDevs: Employee[] = [];
  testers: Employee[] = [];
  uiDevs: Employee[] = [];
  designers: Employee[] = [];
  network: Employee[] = [];

  stats: { label: string; value: number; icon: string; color: string; bg: string }[] = [];
  teams: { role: string; count: number; icon: string; color: string; employees: Employee[] }[] = [];

  ngOnInit() {
    this.updateDateTime();
    this.timer = setInterval(() => this.updateDateTime(), 1000);
    this.employeeService.load().subscribe(() => {
      this.refreshTeams();
      this.loadTodayBirthdays();
    });
  }

  ngOnDestroy() { clearInterval(this.timer); }

  updateDateTime() {
    const now = new Date();
    this.today = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    this.currentTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  refreshTeams() {
    const all = this.employeeService.getAll();
    this.fullStackDevs = all.filter(e => e.role === 'Full-stack Developer');
    this.testers = all.filter(e => e.role === 'Tester');
    this.uiDevs = all.filter(e => e.role === 'UI Developer');
    this.designers = all.filter(e => e.role === 'UI/UX Designer');
    this.network = all.filter(e => e.role === 'Network');

    this.stats = [
      { label: 'Total Members', value: all.length, icon: '👥', color: '#0055a5', bg: '#e8f1fb' },
      { label: 'Full Stack Devs', value: this.fullStackDevs.length, icon: '💻', color: '#00897b', bg: '#e0f5f2' },
      { label: 'Testers', value: this.testers.length, icon: '🧪', color: '#f57c00', bg: '#fff3e0' },
      { label: 'UX / UI Design', value: this.designers.length, icon: '🎨', color: '#8e24aa', bg: '#f3e5f5' },
      { label: 'UI Developers', value: this.uiDevs.length, icon: '🖥️', color: '#e53935', bg: '#fce4ec' },
      { label: 'Network / DevOps', value: this.network.length, icon: '🌐', color: '#00695c', bg: '#e0f2f1' },
    ];

    this.teams = [
      { role: 'Full Stack Developers', icon: '💻', color: '#0055a5', count: this.fullStackDevs.length, employees: this.fullStackDevs },
      { role: 'Testers', icon: '🧪', color: '#f57c00', count: this.testers.length, employees: this.testers },
      { role: 'UX / UI Designers', icon: '🎨', color: '#8e24aa', count: this.designers.length, employees: this.designers },
      { role: 'UI Developers', icon: '🖥️', color: '#e53935', count: this.uiDevs.length, employees: this.uiDevs },
      { role: 'Network / DevOps', icon: '🌐', color: '#00695c', count: this.network.length, employees: this.network },
    ];
  }

  activeTeam: string | null = null;
  selectedTeam: typeof this.teams[0] | null = null;

  selectSegment(team: typeof this.teams[0]) {
    this.selectedTeam = this.selectedTeam?.role === team.role ? null : team;
  }

  get manager() {
    return this.employeeService.getAll().find(e => e.role === 'Project Manager');
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

  logout() {
    this.router.navigate(['/login']);
  }
}
