import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-forbidden-page',
  imports: [
    RouterLink
  ],
  templateUrl: './forbidden-page.html',
})
export class ForbiddenPage {
  private readonly router = inject(Router);
  ROUTES_CONSTANTS = ROUTES_CONSTANTS;
}
