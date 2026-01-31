import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

export const employeeGuard: CanActivateFn = () => {
  const storage = inject(TokenStorageService);
  const router = inject(Router);

  const user = storage.getUser();
  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }

  if (user.role !== 'EMPLOYEE') {
    router.navigateByUrl('/admin/dashboard');
    return false;
  }
  return true;
};
