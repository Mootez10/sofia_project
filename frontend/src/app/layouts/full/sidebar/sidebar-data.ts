import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  { navCap: 'nav.home' },
  { displayName: 'nav.dashboard', iconName: 'layout-grid-add', route: '/dashboard' },

  { navCap: 'nav.userManagement' },
  { displayName: 'nav.users', iconName: 'user', route: '/dashboard/users' },

  { navCap: 'nav.roleManagement' },
  { displayName: 'nav.roles', iconName: 'shield', route: '/dashboard/roles' },
];
