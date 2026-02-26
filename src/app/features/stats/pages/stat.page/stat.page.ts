import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { StatModel } from '@features/stats/models/stat-model';
import { StatService } from '@features/stats/services/stat-service';
import { catchError, map, of } from 'rxjs';
import { UserRoleSelectComponents } from "@features/user-role/components/user-role-select-components/user-role-select-components";
import { UserStatusSelectComponents } from "@features/user-status/components/user-status-select-components/user-status-select-components";
import { CommuneSelectComponents } from "@features/division-commune/components/commune-select-components/commune-select-components";
import { ProvinceSelectComponents } from "@features/division-province/components/province-select-components/province-select-components";
import { RegionSelectComponents } from "@features/division-region/components/region-select-components/region-select-components";
import { EditorialSelectComponents } from "@features/book-editorial/components/editorial-select-components/editorial-select-components";
import { AuthorSelectComponents } from "@features/book-author/components/author-select-components/author-select-components";
import { SubjectSelectComponents } from "@features/book-subject/components/subject-select-components/subject-select-components";

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
    SubjectSelectComponents
],
  templateUrl: './stat.page.html',
})
export class StatPage {
  private readonly statService = inject(StatService)

  private readonly statsRX = rxResource({
    stream: () => {    
      return this.statService.getAll().pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          return of(null);
        })
      );
    },
  });

  readonly statsComputedList = computed<StatModel | null>(() => {
    const data = this.statsRX.value();
    if (!data) return null;
    return data
  });

}
