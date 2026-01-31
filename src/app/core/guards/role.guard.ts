import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

export const adminGuard: CanActivateFn = () => {
  const storage = inject(TokenStorageService);
  const router = inject(Router);

  const user = storage.getUser();

  // Pas connecté
  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }

  // Pas admin
  if (user.role !== 'ADMIN') {
    router.navigateByUrl('/employee/dashboard');
    return false;
  }

  return true;
};
