import { Component, computed, effect, inject, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserProfileVM } from '@features/user/models/user-profile.vm';
import { UserUpdateModel } from '@features/user/models/user-update-model';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, map, NEVER } from 'rxjs';


@Component({
  selector: 'app-user-form.page',
  imports: [
    SectionHeaderComponent,
    UserFormComponents,
    MessageErrorComponent
],
  templateUrl: './user-form.page.html',
})
export class UserFormPage {
// ─────────────────────────────────────────────────────────────────────────────
// ─── NAVEGACIÓN
 private readonly state = history.state as {
  userProfileVM?: UserProfileVM;
  navigateBack?: string;
};

readonly userProfileVM  = signal<UserProfileVM | null>(this.state.userProfileVM ?? null);
readonly navigateGoBack = signal<string>(this.state.navigateBack ?? '/');

// ─────────────────────────────────────────────────────────────────────────────
// SERVICIOS
private readonly userService = inject(UserService);
private readonly router = inject(Router);

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO DERIVADO
readonly isLoading = signal<boolean>(false);
readonly errorMessage = signal<string | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT
protected onUserFormSubmit(vm: UserProfileVM): void {
  console.log(vm)

  if (!vm.id_user) {
    this.errorMessage.set('ID de usuario no encontrado');
    return;
  }

  const dto: UserUpdateModel = {
    name: vm.name ?? '',
    lastname: vm.lastname ?? '',
    rut: vm.rut ?? '',
    address: vm.address ?? '',
    phone: vm.phone ?? '',
    commune_id: vm.commune_id ?? 0,
  };

  console.log(dto)
}

  //protected onUserFormSubmit(data: Partial<UserModel>) {
  //  this.isLoading.set(true);
  
  //  const request$ = data.id_user
  //    ? this.userService.update(data.id_user, data)
  //    : this.userService.create(data);
  
  //  request$.subscribe({
  //    next: () => {
  //      this.isLoading.set(false);
        // navegar atrás
  //    },
  //    error: (err) => {
  //      this.isLoading.set(false);
  //      console.error(err);
  //    },
  //  });
  //}
  

}
