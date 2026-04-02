import { Component, computed, ElementRef, inject, input, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CreateReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, finalize, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-reservation-btn-create-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './reservation-btn-create-components.html',
})
export class ReservationBtnCreateComponents {
  readonly idCopy = input<number>();
  readonly bookName = input<string>();

  readonly isLoading = computed<boolean>(() => this.reservationRX.isLoading());
  readonly errorMessage = signal<string | null>(null);
  readonly succesMessage = signal<string | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  
  @ViewChild('dialogRef') private dialogRef!: ElementRef<HTMLDialogElement>;
  
  private readonly reservationService = inject(ReservationService);
  private readonly reservationPayload = signal<CreateReservationModel | null>(null); 

  private readonly reservationRX = rxResource({
    params: () => this.reservationPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy) return of(null);

      return this.reservationService.create(id_copy).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.succesMessage.set(response.message);
          this.errorMessage.set(null);
          return response.result;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.succesMessage.set(null);
          this.errorMessage.set(message);
          return of(null);
        }),
        finalize(() => {
          this.toggleModal(false);
        })
      );
    }
  });

  protected onPreOrder(): void {
    if (!this.idCopy()) {
      this.succesMessage.set(null);
      this.errorMessage.set('Error en la reserva');
      return;
    }

    this.reservationPayload.set({ 
      copy_id: this.idCopy() 
    } as CreateReservationModel);
  }

  protected toggleModal(toggle: boolean): void {
    this.isModalOpen.set(toggle);
    const dialog = this.dialogRef.nativeElement;
    toggle ? dialog.showModal() : dialog.close();
  }
}
