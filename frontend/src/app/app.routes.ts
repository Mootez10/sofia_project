import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'profile' , component: ProfileComponent, canActivate:[authGuard, roleGuard],
         data: { allowedRoles: ['user'] },
      },
      
      {
        path: 'dashboard', canActivate:[authGuard],
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },

  {
    path: 'dashboard/users',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['admin', 'developer'] },
    loadComponent: () => import('./pages/usermanagement/list-user/list-user.component').then(m => m.ListUserComponent)
  },

  {
    path: 'dashboard/roles',
    canActivate: [authGuard, roleGuard],
    data: { allowedRoles: ['admin'] },
    loadComponent: () => import('./pages/rolemanagement/list-role/list-role.component').then(m => m.ListRoleComponent)
  },

  {
    path: 'not-authorized',
    loadComponent: () => import('./pages/not-authorized/not-authorized/not-authorized.component').then(m => m.NotAuthorizedComponent)
  }
  
  
];
