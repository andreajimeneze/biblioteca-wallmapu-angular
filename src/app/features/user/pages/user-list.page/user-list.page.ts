import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserFeatureService } from '@features/user/services/user-feature-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-list.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
  ],
  templateUrl: './user-list.page.html',
})
export class UserListPage {
  ROUTES_CONSTANTS=ROUTES_CONSTANTS

  private readonly feature = inject(UserFeatureService);

  readonly isLoading = this.feature.isLoading;
  readonly errorMessage = this.feature.errorMessage;
  readonly userResult = this.feature.userResult;
}
