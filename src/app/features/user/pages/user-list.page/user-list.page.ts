import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserFeatureService } from '@features/user/services/user-feature-service';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-list.page',
  imports: [
    CommonModule,
    SectionHeaderComponent,
  ],
  templateUrl: './user-list.page.html',
})
export class UserListPage {
  // RUTAS
  ROUTES_CONSTANTS=ROUTES_CONSTANTS

  // SERVICIOS DE OTRAS FEATURES
  private readonly feature = inject(UserFeatureService);
  readonly isLoading = this.feature.isLoading;
  readonly errorMessage = this.feature.errorMessage;
  readonly userResult = this.feature.userResult;

  // SERVICIO DE ESTA FEATURE
  private readonly userService = inject(UserService);

  private readonly data = rxResource({
    stream: () =>
      this.userService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error("que");

          return response;
        })
      ),
  });
  

}
