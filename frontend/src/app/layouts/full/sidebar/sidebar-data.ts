import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },

  {
    navCap: 'User Management',
  },
  {
    displayName: 'Users',
    iconName: 'user',
    route: '/dashboard/users',
  },
  {
    navCap: 'Role Management',
  },
  {
    displayName: 'Roles',
    iconName: 'shield',
    route: '/dashboard/roles',
  },
];
