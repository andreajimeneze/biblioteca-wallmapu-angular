import { Component, inject, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserModel } from '@features/user/models/user-model';
import { UserFeatureService } from '@features/user/services/user-feature-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-form.page',
  imports: [
    UserFormComponents,
    SectionHeaderComponent
],
  templateUrl: './user-form.page.html',
})
export class UserFormPage {
  ROUTES_CONSTANTS=ROUTES_CONSTANTS;
  private readonly feature = inject(UserFeatureService);

  readonly isLoading = this.feature.isLoading;
  readonly errorMessage = this.feature.errorMessage;
  readonly userResult = this.feature.userResult;
  
  protected onUserFormSubmit(data: Partial<UserModel>) {
    console.log('Datos recibidos del hijo:', data);
  }
}
