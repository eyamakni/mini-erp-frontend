import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/role.guard';
export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent),
  },


  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/change-password/change-password.component')
        .then(m => m.ChangePasswordComponent),
  },
   {
    path: 'admin/jobs',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/jobs/admin-jobs-list.component')
        .then(m => m.AdminJobsListComponent),
  },
    {
    path: 'admin/jobs/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/jobs/admin-jobs-create.component')
        .then(m => m.AdminJobsCreateComponent),
  },


  {
    path: 'employee/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/employee/employee-dashboard/employee-dashboard.component')
        .then(m => m.EmployeeDashboardComponent),
  },
  {
  path: 'employee/leaves',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/employee/employee-leaves/employee-leaves.component')
      .then(m => m.EmployeeLeavesComponent),
},
{
  path: 'employee/meetings',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/employee/employee-meetings/employee-meetings.component')
      .then(m => m.EmployeeMeetingsComponent),
},
{
  path: 'employee/meetings/new',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./features/employee/employee-meeting-create/employee-meeting-create.component')
      .then(m => m.EmployeeMeetingCreateComponent),
},



  {
  path: 'admin/employees/new',
  canActivate: [authGuard, adminGuard],
  loadComponent: () =>
    import('./features/admin/admin-create-employee/admin-create-employee.component')
      .then(m => m.AdminCreateEmployeeComponent),
},
{
  path: 'admin/employees',
  canActivate: [authGuard, adminGuard],
  loadComponent: () =>
    import('./features/admin/admin-employees/admin-employees.component')
      .then(m => m.AdminEmployeesComponent),
},


  {
    path: 'admin/dashboard',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-dashboard/admin-dashboard.component')
        .then(m => m.AdminDashboardComponent),
  },
   {
    path: 'admin/applications',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/applications/admin-applications-list/admin-applications-list.component')
        .then(m => m.AdminApplicationsListComponent),
  },
  {
    path: 'admin/applications/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/applications/admin-application-detail/admin-application-detail.component')
        .then(m => m.AdminApplicationDetailComponent),
  },
  {
  path: 'admin/leaves',
  canActivate: [authGuard, adminGuard],
  loadComponent: () =>
    import('./features/admin/admin-leaves/admin-leaves.component')
      .then(m => m.AdminLeavesComponent),
},
{
  path: 'admin/leaves/:id',
  canActivate: [authGuard, adminGuard],
  loadComponent: () =>
    import('./features/admin/admin-leave-detail/admin-leave-detail.component')
      .then(m => m.AdminLeaveDetailComponent),
},
 {
    path: 'admin/leaves',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-leaves/admin-leaves.component')
        .then(m => m.AdminLeavesComponent),
  },
{
    path: 'admin/leaves/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-leave-detail/admin-leave-detail.component')
        .then(m => m.AdminLeaveDetailComponent),
  },


  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },

];
