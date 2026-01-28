import { Component } from '@angular/core';
import { ADMIN_NAVIGATION } from '@shared/constants/admin-navigation';
import { DashboardComponent } from "@shared/components/dashboard-component/dashboard-component";
import { ArrowUpComponent } from "@shared/components/arrow-up-component/arrow-up-component";

@Component({
  selector: 'app-admin-layout',
  imports: [
    DashboardComponent,
    ArrowUpComponent
],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  protected readonly navigationItems = ADMIN_NAVIGATION;
}
