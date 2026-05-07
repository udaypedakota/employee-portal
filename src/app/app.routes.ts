import { Routes } from '@angular/router';
import { Login } from './login/login';
import { MainDashboard } from './main-dashboard/main-dashboard';
import { Dashboard } from './dashboard/dashboard';
import { EmployeeDetail } from './employee/employee';
import { WorkStatusComponent } from './work-status/work-status';
import { HolidaysComponent } from './holidays/holidays';
import { MyProfileComponent } from './my-profile/my-profile';
import { LayoutComponent } from './shared/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'main-dashboard', component: MainDashboard },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'employee/:id', component: EmployeeDetail },
      { path: 'work-status', component: WorkStatusComponent },
      { path: 'holidays', component: HolidaysComponent },
      { path: 'my-profile', component: MyProfileComponent },
    ]
  }
];
