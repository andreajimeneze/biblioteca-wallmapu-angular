import { Component, input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ADMIN_NAVIGATION } from '@shared/constants/admin-navigation';
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";
import { NavigationItem } from '@shared/models/NavigationItem';

@Component({
  selector: 'app-dashboard-component',
  imports: [
    RouterOutlet,
    RouterLink,
    AuthButtonComponent
],
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent {
  navigationItems = input.required<NavigationItem[]>();
}
