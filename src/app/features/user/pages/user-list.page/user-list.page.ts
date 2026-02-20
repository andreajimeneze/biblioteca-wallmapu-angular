import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserProfileVM } from '@features/user/models/user-profile.vm';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { map } from 'rxjs';
import { UserListComponents } from "@features/user/components/user-list-components/user-list-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { Role } from '@shared/constants/roles-enum';

@Component({
  selector: 'app-user-list.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
    UserListComponents,
    MessageErrorComponent,
    PaginationComponent
],
  templateUrl: './user-list.page.html',
})
export class UserListPage {
  // SERVICIO DE FEATURE
  private readonly userService = inject(UserService);

  private readonly dataRX = rxResource({
    stream: () => {    
      return this.userService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
  
          return response.result; // 👈 devolvemos solo el UserModel
        })
      );
    },
  });

  // ESPERA QUE FINALICE RX
  readonly isLoading = this.dataRX.isLoading;

  // CONTROL DE ERROES
  readonly backendError = computed(() => this.dataRX.error()?.message ?? null);

  // PROCESAR USER
  readonly userProfileVMList = computed<UserProfileVM[] | []>(() => {
    const users = this.dataRX.value();
  
    if (!users) return [];

    return users.map(user => ({
      ...user,
      role: Role.Reader,
      picture: null
    }));
  });
  
}
