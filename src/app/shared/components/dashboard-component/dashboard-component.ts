import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavbarComponent } from '@shared/components/dashboard-navbar-component/dashboard-navbar-component';
import { DashboardSidebarComponent } from '@shared/components/dashboard-sidebar-component/dashboard-sidebar-component';
import { ArrowUpComponent } from '@shared/components/arrow-up-component/arrow-up-component';
import { NavigationModel } from '@shared/models/navigation-model';

@Component({
  selector: 'app-dashboard-component',
  imports: [
    RouterOutlet,
    DashboardNavbarComponent,
    DashboardSidebarComponent,
    ArrowUpComponent,
],
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent {
  navigation = input.required<NavigationModel[]>();
}
