import { Component, inject } from '@angular/core';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { UserStatusSelectComponents } from "@features/user-status/components/user-status-select-components/user-status-select-components";
import { UserRoleSelectComponents } from "@features/user-role/components/user-role-select-components/user-role-select-components";
import { CommuneSelectComponents } from "@features/commune/components/commune-select-components/commune-select-components";
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { CommonModule } from '@angular/common';
import { AuthService } from '@features/auth/services/auth-service';
import { AuthStore } from '@features/auth/services/auth-store';

@Component({
  selector: 'app-test-page',
  imports: [
    CommonModule,
    MessageSuccessComponent, 
    MessageErrorComponent, 
    UserStatusSelectComponents, 
    UserRoleSelectComponents, 
    CommuneSelectComponents, 
    AuthButtonComponent, 
    LoadingComponent, 
    SectionHeaderComponent, 
    HeaderComponent
  ],
  templateUrl: './test-page.html',
})
export class TestPage {
  private readonly authService = inject(AuthStore)
  readonly user = this.authService.user
}
