import { Component, inject, input, output, signal } from '@angular/core';
import { ReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-reservation-btn-cancel-components',
  imports: [
    ModalDeleteComponent
  ],
  templateUrl: './reservation-btn-cancel-components.html',
})
export class ReservationBtnCancelComponents {
  readonly reservationModel = input<ReservationModel | null>(null);
  readonly reload = output<void>();

  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);  
  private readonly reservationService = inject(ReservationService);
  protected readonly isLoading = signal(false);
  
  protected onUpdate(): void {
    this.isModalOpen.set(true);
  }

  protected onModalCancel(): void { 
    this.isModalOpen.set(false);
  }

  protected onModalConfirm(): void {
    const id = this.reservationModel()?.id_reservation;
    if (!id) return;
  
    this.isLoading.set(true);
  
    this.reservationService.cancel(id).pipe(
      tap(() => {
        this.reload.emit();
        this.isModalOpen.set(false);
      }),
      finalize(() => this.isLoading.set(false)),
      catchError(() => of(null))
    ).subscribe();
  }
}
