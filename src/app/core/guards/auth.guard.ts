import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

export const authGuard: CanActivateFn = () => {
  const storage = inject(TokenStorageService);
  const router = inject(Router);

  if (storage.getAccessToken()) return true;

  router.navigateByUrl('/login');
  return false;
};
