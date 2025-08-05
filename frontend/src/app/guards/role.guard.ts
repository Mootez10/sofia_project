import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['allowedRoles'] as string[];
  const userRole = localStorage.getItem('userRole');

  if (authService.isLoggedIn() && userRole && allowedRoles.includes(userRole)) {
    return true;
  } else {
    router.navigate(['/not-authorized']);
    return false;
  }
};
