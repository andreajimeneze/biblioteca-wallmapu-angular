import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of, throwError } from 'rxjs';
import { UserRoleSelectComponents } from "@features/user-role/components/user-role-select-components/user-role-select-components";
import { UserStatusSelectComponents } from "@features/user-status/components/user-status-select-components/user-status-select-components";
import { CommuneSelectComponents } from "@features/division-commune/components/commune-select-components/commune-select-components";
import { ProvinceSelectComponents } from "@features/division-province/components/province-select-components/province-select-components";
import { RegionSelectComponents } from "@features/division-region/components/region-select-components/region-select-components";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";
import { SubjectSelectComponents } from "@features/book-subject/components/subject-select-components/subject-select-components";
import { ModalErrorComponent } from "@shared/components/modal-error-component/modal-error-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-stat.page',
  imports: [
    UserRoleSelectComponents,
    UserStatusSelectComponents,
    CommuneSelectComponents,
    ProvinceSelectComponents,
    RegionSelectComponents,
    EditorialSelectComponents,
    AuthorSelectComponents,
    SubjectSelectComponents,
    MessageErrorComponent
],
  templateUrl: './stat.page.html',
})
export class StatPage {
  private readonly statService = inject(StatService)
  private readonly backendError = signal<string | null>(null)

  private readonly statsRX = rxResource({
    stream: () => {
      this.backendError.set(null)

      return this.statService.getAll().pipe(
        map(res => {
          if (!res.isSuccess) throw new Error(res.message || 'Unexpected error');
          return res.result;
        }),
        catchError(err => {
          const message =
            err?.error?.detail ||
            err?.error?.message ||
            err?.message ||
            'Unexpected error';

          this.backendError.set(message)
          return of(null);
        })
      );
    },
  });

  protected readonly isLoading = computed(() => this.statsRX.isLoading());
  protected readonly errorMessage = computed(() => this.backendError() ?? null);
  readonly statsComputedList = computed<StatModel | null>(() => this.statsRX.value() ?? null);

}
