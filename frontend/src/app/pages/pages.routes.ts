import { Routes } from '@angular/router';
import { ListUserComponent } from './usermanagement/list-user/list-user.component';
import { ListRoleComponent } from './rolemanagement/list-role/list-role.component';
import { AddUserComponent } from './usermanagement/add-user/add-user.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized/not-authorized.component';


export const PagesRoutes: Routes = [
  {
    path: 'users',
    component: ListUserComponent,
  },
  {
    path: 'roles',
    component: ListRoleComponent,
  },
  { path: 'add-user', component: AddUserComponent },

];
