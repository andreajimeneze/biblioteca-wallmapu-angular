import { Component } from '@angular/core';
import { DashboardComponent } from '@layouts/components/dashboard-component/dashboard-component';
import { NAVIGATION_ADMIN } from '@shared/constants/navigation-admin';

@Component({
  selector: 'app-layout-admin',
  imports: [
    DashboardComponent,
  ],
  templateUrl: './layout-admin.html',
})
export class LayoutAdmin {
  protected readonly navigation = NAVIGATION_ADMIN;
}
