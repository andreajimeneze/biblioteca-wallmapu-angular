import { Component, computed, effect, inject, signal } from '@angular/core';
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";
import { UserProfileVM } from '@features/user/models/user-profile.vm';
import { UserUpdateModel } from '@features/user/models/user-update-model';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { map, of } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-user-form.page',
  imports: [
    JsonPipe,
    SectionHeaderComponent,
    UserFormComponents,
    MessageErrorComponent
],
  templateUrl: './user-form.page.html',
})
export class UserFormPage {
  // ─── NAVEGACIÓN ───────────────────────────────────────────────────────────────
  private readonly state = history.state as {
    userProfileVM?: UserProfileVM;
    navigateBack?: string;
  };

  readonly userProfileVM  = signal<UserProfileVM | null>(this.state.userProfileVM ?? null);
  readonly navigateGoBack = signal<string>(this.state.navigateBack ?? '/');

  // ─── SERVICIOS ────────────────────────────────────────────────────────────────
  private readonly userService = inject(UserService);
  private readonly router      = inject(Router);

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
  readonly isLoading    = this.updateRX.isLoading;
  readonly errorMessage = computed(() => this.updateRX.error()?.message ?? null);

  // ─── EFECTO NAVEGACIÓN ────────────────────────────────────────────────────────
  private readonly onUpdateSuccess = effect(() => {
    if (
      this.submitPayload() !== null &&
      this.updateRX.value() !== undefined &&
      !this.updateRX.isLoading() &&
      !this.updateRX.error()
    ) {
      this.router.navigateByUrl(this.navigateGoBack());
    }
  });

  // ─── SUBMIT ───────────────────────────────────────────────────────────────────
  protected onUserFormSubmit(vm: UserProfileVM): void {
    if (!vm.id_user) return;

    this.submitPayload.set({
      id: vm.id_user,
      dto: {
        name:       vm.name       ?? '',
        lastname:   vm.lastname   ?? '',
        rut:        vm.rut        ?? '',
        address:    vm.address    ?? '',
        phone:      vm.phone      ?? '',
        commune_id: vm.commune_id ?? 0,
      }
    });
  }

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
  