import { Component, computed, effect, inject, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserUpdateModel } from '@features/user/models/user-update-model';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
import { Role } from '@shared/constants/roles-enum';
import { UserModel } from '@features/user/models/user-model';
import { UserDetailModel } from '@features/user/models/user-detail-model';

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
  // ─── NAVEGACIÓN ───────────────────────────────────────────────────────────────
  private readonly state = history.state as {
    editRole: Role;
    picture: string;
    userDetailModel: UserDetailModel ;
    navigateBack: string;
  };

  readonly editRole = signal<Role>(this.state.editRole);
  readonly picture = signal<string>(this.state.picture);
  readonly navigateGoBack = signal<string>(this.state.navigateBack);
  readonly userModel = signal<UserModel | null>(
    this.state.userDetailModel
    ? {
        id_user: this.state.userDetailModel.id_user,
        email: this.state.userDetailModel.email,
        name: this.state.userDetailModel.name,
        lastname: this.state.userDetailModel.lastname,
        rut: this.state.userDetailModel.rut,
        address: this.state.userDetailModel.address,
        phone: this.state.userDetailModel.phone,
        created_at: this.state.userDetailModel.created_at,
        updated_at: this.state.userDetailModel.updated_at,
        commune_id: this.state.userDetailModel.commune_id,
        user_role_id: this.state.userDetailModel.user_role_id,
        user_status_id: this.state.userDetailModel.user_status_id,
      }
    : null
  );

  // ─── SERVICIOS ────────────────────────────────────────────────────────────────
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  // ─── TRIGGER MUTACIÓN ─────────────────────────────────────────────────────────
  private readonly submitPayload = signal<{ 
    id: string; 
    userUpdateModel: UserUpdateModel; 
  } | null>(null);

  // ─── RX RESOURCE ──────────────────────────────────────────────────────────────
  private readonly updateRX = rxResource({
    params: () => this.submitPayload(),
    stream: ({ params: payload }) => {
      if (!payload) return of(null);

      const request$ =
      this.editRole() === Role.Admin
        ? this.userService.update_admin(payload.id, payload.userUpdateModel)
        : this.userService.update_user(payload.id, payload.userUpdateModel);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        })
      );
    },
  });

  // ─── ESTADO DERIVADO ──────────────────────────────────────────────────────────
  readonly isLoading = this.updateRX.isLoading;
  readonly errorMessage = computed(() => this.updateRX.error()?.message ?? null);

  // ─── EFECTO NAVEGACIÓN ────────────────────────────────────────────────────────
  private readonly onUpdateSuccess = effect(() => {
    const payload = this.submitPayload();

    if (!payload) return;                    // 👈 nunca navegar si no hubo submit
    if (this.updateRX.isLoading()) return;   // 👈 evitar mientras carga
    if (this.updateRX.error()) return;       // 👈 no navegar si hay error
  
    const value = this.updateRX.value();
  
    if (value) {
      this.router.navigateByUrl(this.navigateGoBack());
    }
  });

  // ─── SUBMIT ───────────────────────────────────────────────────────────────────
  protected onUserFormSubmit(model: UserModel): void {
    if (!model.id_user) return;

    this.submitPayload.set({
      id: model.id_user,
      userUpdateModel: {
        name: model.name,
        lastname: model.lastname,
        rut: model.rut,
        address: model.address,
        phone: model.phone,
        commune_id: model.commune_id,
        user_role_id: model.user_role_id,
        user_status_id: model.user_status_id
      }
    });
  }

}
