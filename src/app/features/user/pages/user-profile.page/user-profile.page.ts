import { Component, computed, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '@features/user/services/user-service';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { UserModel } from '@features/user/models/user-model';
import { AuthStore } from '@features/auth/services/auth-store';
import { AuthUser } from '@features/auth/models/auth-user';
import { CommuneSelectComponents } from "@features/commune/components/commune-select-components/commune-select-components";
import { UserFormComponents } from "@features/user/components/user-form-components/user-form-components";

@Component({
  selector: 'app-user-profile.page',
  imports: [
    CommonModule,
    LoadingComponent,
    MessageErrorComponent,
    SectionHeaderComponent,
    NgOptimizedImage,
    DatePipe,
    CommuneSelectComponents,
    UserFormComponents
],
  templateUrl: './user-profile.page.html',
})
export class UserProfilePage {
  private readonly authStore = inject(AuthStore);
  private readonly userService = inject(UserService);

  readonly loading = signal(true)
  readonly authUser = signal<AuthUser | null>(null)

  private userSignal = toSignal(
    toObservable(this.authStore.user).pipe(
      tap(() => this.loading.set(true)),
      switchMap(user => {
        if (!user?.id_user) return of(undefined);
        
        this.authUser.set(user)

        return this.userService.getById(user.id_user).pipe(
          catchError((err) => {
            this.loading.set(false)

            return of({
              isSuccess: false,
              statusCode: 500,
              message: err?.message || String(err),
              result: null
            });
          }),
          finalize(() => this.loading.set(false)),
        );
      })
    ),
    { initialValue: undefined }
  );
  
  // ✅ Estados computados
  userResult = computed(() => this.userSignal());

  /* -- Form data ----------------------------------------- */
  readonly formData = signal<Partial<UserModel>>({
    name: this.userResult()?.result?.name ?? '',
    lastname: this.userResult()?.result?.lastname ?? '',
    rut: this.userResult()?.result?.rut ?? '',
    address: this.userResult()?.result?.address ?? '',
    phone: this.userResult()?.result?.phone ?? ''
  });

  /* -- Form Updates -------------------------------------- */
  readonly formErrorMessage = signal<string | null>(null);

  protected updateName(value: string) { this.updateField('name', value); }
  protected updateLastname(value: string) { this.updateField('lastname', value); }
  protected updateRut(value: string) { this.updateField('rut', value); }
  protected updateAddress(value: string) { this.updateField('address', value); }
  protected updatePhone(value: string) { this.updateField('phone', value); }
  
  private updateField<K extends keyof UserModel>(key: K, value: string) {
    this.formData.update(data => ({ ...data, [key]: value }));
    this.formErrorMessage.set(null);
  }

  private readonly syncFormEffect = effect(() => {
    const result = this.userResult();
  
    if (result?.isSuccess && result.result) {
      this.formData.set({
        name: result.result.name ?? '',
        lastname: result.result.lastname ?? '',
        rut: result.result.rut ?? '',
        address: result.result.address ?? '',
        phone: result.result.phone ?? ''
      });
    }
  });

  /* -- Submit -------------------------------------------- */
  onSubmit(event: Event) {

  }
}
