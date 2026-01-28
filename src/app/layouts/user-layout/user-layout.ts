import { Component } from '@angular/core';
import { DashboardComponent } from "@shared/components/dashboard-component/dashboard-component";
import { USER_NAVIGATION } from '@shared/constants/user-navigation';

@Component({
  selector: 'app-user-layout',
  imports: [
    DashboardComponent,
],
  templateUrl: './user-layout.html',
})
export class UserLayout {
  protected readonly navigationItems = USER_NAVIGATION;
}
