import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { MainDashboard } from './main-dashboard/main-dashboard';
import { EmployeeDetail } from './employee/employee';
import { WorkStatusComponent } from './work-status/work-status';
import { BirthdayTrackerComponent } from './birthday-tracker/birthday-tracker';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'main-dashboard', component: MainDashboard },
  { path: 'employee/:id', component: EmployeeDetail },
  { path: 'work-status', component: WorkStatusComponent },
  { path: 'birthday-tracker', component: BirthdayTrackerComponent },
];
