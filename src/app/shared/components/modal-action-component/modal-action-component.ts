import { Component, input, output } from '@angular/core';
import { LoadingComponent } from "../loading-component/loading-component";

@Component({
  selector: 'app-modal-action-component',
  imports: [
    LoadingComponent
],
  templateUrl: './modal-action-component.html',
})
export class ModalActionComponent {
  // Estado
  readonly isOpen = input.required<boolean>();
  readonly isLoading = input.required<boolean>();
  
  // Contenido dinámico
  readonly textTitle = input<string>('Confirmar acción');
  readonly textContent = input<string>('Sin Contenido:');
  readonly textName = input<string | undefined>('Nombre');

  // Eventos
  readonly onConfirm = output<void>();
  readonly onModalClose = output<void>();
}
