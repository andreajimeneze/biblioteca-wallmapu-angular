import { Component, computed, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserModel } from '@features/user/models/user-model';
import { UserProfileVM } from '@features/user/models/user-profile.vm';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";

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
  private readonly state = history.state as {
    userProfileVM?: UserProfileVM;
    navigateBack?: string;
  };

  private readonly initialData: UserProfileVM | null = this.state.userProfileVM ?? null;
  private readonly navigateBack: string = this.state.navigateBack ?? '/';

  readonly userProfileVM = signal<UserProfileVM | null>(this.initialData);
  readonly navigateGoBack = signal<string>(this.navigateBack);

  readonly isLoading = computed(() => this.userProfileVM() === null);

  protected onUserFormSubmit(data: Partial<UserModel>) {
    console.log('Datos recibidos del hijo:', data);
  }
}
