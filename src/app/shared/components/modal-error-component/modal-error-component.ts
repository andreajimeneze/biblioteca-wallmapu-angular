import { Component, inject } from '@angular/core';
import { ErrorModalService } from '@core/services/error-modal-service';

@Component({
  selector: 'app-modal-error-component',
  imports: [],
  templateUrl: './modal-error-component.html',
})
export class ModalErrorComponent {
  private modal = inject(ErrorModalService);

  isOpen = this.modal.isOpen;
  statusCode = this.modal.statusCode;
  message = this.modal.message;

  close() {
    this.modal.close();
  }
}
