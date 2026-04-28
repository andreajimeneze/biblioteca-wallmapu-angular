import { Component, input, output } from '@angular/core';
import { LoadingComponent } from "../loading-component/loading-component";

@Component({
  selector: 'app-modal-delete-component',
  imports: [LoadingComponent],
  templateUrl: './modal-delete-component.html',
})
export class ModalDeleteComponent {
  // Estado
  readonly isOpen = input.required<boolean>();
  readonly isLoading = input.required<boolean>();
  
  // Contenido dinámico
  readonly title = input<string>('Confirmar acción');
  readonly contentText = input<string>('¿Estás seguro que deseas eliminar:');
  readonly itemName = input<string | undefined>('???');

  // Eventos
  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
