import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-not-found-page',
  imports: [
    RouterLink
  ],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {
  protected readonly ROUTES_CONSTANTS = ROUTES_CONSTANTS;
}
