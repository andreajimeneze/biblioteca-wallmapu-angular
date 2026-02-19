import { Component, computed, inject, input, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserModel } from '@features/user/models/user-model';
import { UserProfileVM } from '@features/user/models/user-profile.vm';
import { UserFeatureService } from '@features/user/services/user-feature-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  selector: 'app-user-form.page',
  imports: [
    //UserFormComponents,
    SectionHeaderComponent,
    UserFormComponents
],
  templateUrl: './user-form.page.html',
})
export class UserFormPage {
  ROUTES_CONSTANTS=ROUTES_CONSTANTS;
  private readonly initialData: UserProfileVM | null = history.state.userProfileVMurl;
  readonly userProfileVM = signal<UserProfileVM | null>(this.initialData);
  
  readonly isLoading = computed(() => this.userProfileVM() === null);



  protected onUserFormSubmit(data: Partial<UserModel>) {
    console.log('Datos recibidos del hijo:', data);
  }
}
