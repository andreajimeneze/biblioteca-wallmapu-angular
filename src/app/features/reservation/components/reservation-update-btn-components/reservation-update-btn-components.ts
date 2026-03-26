import { Component, inject, output, signal } from '@angular/core';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, finalize, of, tap } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-reservation-update-btn-components',
  imports: [LoadingComponent],
  templateUrl: './reservation-update-btn-components.html',
})
export class ReservationUpdateBtnComponents {
  readonly reload = output<void>();
  
  private readonly reservationService = inject(ReservationService);
  protected readonly isLoading = signal(false);
  
  protected onUpdate(): void {
    this.isLoading.set(true);
    
    this.reservationService.expire().pipe(
      tap(() => {
        this.reload.emit();
      }),
      finalize(() => this.isLoading.set(false)),
      catchError(() => of(null))
    ).subscribe();
  }
}
