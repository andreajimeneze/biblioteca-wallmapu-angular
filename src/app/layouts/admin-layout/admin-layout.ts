import { Component } from '@angular/core';
import { NAVIGATION_ADMIN } from '@shared/constants/navigation-admin';
import { DashboardComponent } from "@shared/components/dashboard-component/dashboard-component";

@Component({
  selector: 'app-admin-layout',
  imports: [
    DashboardComponent
],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  protected readonly navigation = NAVIGATION_ADMIN;
}
