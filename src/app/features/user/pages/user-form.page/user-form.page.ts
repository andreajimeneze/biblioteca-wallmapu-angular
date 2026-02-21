import { Component, computed, effect, inject, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserUpdateModel } from '@features/user/models/user-update-model';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
import { UserFormVM } from '@features/user/models/user-form.vm';
import { UserProfileVM } from '@features/user/models/user-profile.vm';

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
    userProfileVM ?: UserProfileVM ;
    navigateBack?: string;
  };

  readonly userFormVM = signal<UserFormVM | null>(
    this.state.userProfileVM
    ? {
        id_user: this.state.userProfileVM.id_user,
        email: this.state.userProfileVM.email,
        name: this.state.userProfileVM.name,
        lastname: this.state.userProfileVM.lastname,
        rut: this.state.userProfileVM.rut,
        address: this.state.userProfileVM.address,
        phone: this.state.userProfileVM.phone,
        created_at: this.state.userProfileVM.created_at,
        updated_at: this.state.userProfileVM.updated_at,
        commune_id: this.state.userProfileVM.commune_id,
        user_role_id: this.state.userProfileVM.user_role_id,
        user_status_id: this.state.userProfileVM.user_status_id,
        picture: this.state.userProfileVM.picture
      }
    : null
  );
  readonly navigateGoBack = signal<string>(this.state.navigateBack ?? '/');

  // ─── SERVICIOS ────────────────────────────────────────────────────────────────
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  // ─── TRIGGER MUTACIÓN ─────────────────────────────────────────────────────────
  private readonly submitPayload = signal<{ id: string; dto: UserUpdateModel } | null>(null);

  // ─── RX RESOURCE ──────────────────────────────────────────────────────────────
  private readonly updateRX = rxResource({
    params: () => this.submitPayload(),
    stream: ({ params: payload }) => {
      if (!payload) return of(null);

      return this.userService.update(payload.id, payload.dto).pipe(
        map(response => {
          // Error de negocio → va a errorMessage
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        })
        // Errores HTTP → interceptor los maneja globalmente con modal
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
  protected onUserFormSubmit(model: UserFormVM): void {
    if (!model.id_user) return;

    this.submitPayload.set({
      id: model.id_user,
      dto: {
        name: model.name ?? '',
        lastname: model.lastname ?? '',
        rut: model.rut ?? '',
        address: model.address ?? '',
        phone: model.phone ?? '',
        commune_id: model.commune_id ?? 0,
      }
    });
  }

}
