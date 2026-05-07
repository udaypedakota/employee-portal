import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { EmployeeDetail } from './employee/employee';
import { WorkStatusComponent } from './work-status/work-status';
import { HolidaysComponent } from './holidays/holidays';
import { MyProfileComponent } from './my-profile/my-profile';
import { LayoutComponent } from './shared/layout/layout';
import { SettingsComponent } from './settings/settings';
import { HelpCenterComponent } from './help-center/help-center';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'employee/:id', component: EmployeeDetail },
      { path: 'work-status', component: WorkStatusComponent },
      { path: 'holidays', component: HolidaysComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'help-center', component: HelpCenterComponent },
    ]
  }
];
