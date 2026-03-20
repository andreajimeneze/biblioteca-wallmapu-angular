import { inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '@core/models/api-response-model';
import { ApiResponseService } from '@core/services/api-response-service';
import { Observable, tap } from 'rxjs';
import { EditionCopyStatusModel } from '@features/edition-copy-status/models/edition-copy-status-model';

@Injectable({
  providedIn: 'root',
})
export class EditionCopyStatusService {
  private apiResponseService = inject(ApiResponseService)
  private readonly endpoint = 'edition-copy-status';
  private cache: { data: ApiResponseModel<EditionCopyStatusModel[]>; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  getAll(): Observable<ApiResponseModel<EditionCopyStatusModel[]>> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL) {
      return new Observable(subscriber => {
        subscriber.next(this.cache!.data);
        subscriber.complete();
      });
    }

    return this.apiResponseService.getAll<ApiResponseModel<EditionCopyStatusModel[]>>(
      `${this.endpoint}`
    ).pipe(
      tap(response => {
        if (response.isSuccess) {
          this.cache = { data: response, timestamp: Date.now() };
        }
      })
    );
  }
}
