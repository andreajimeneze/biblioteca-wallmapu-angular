import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-image-component',
  imports: [],
  templateUrl: './modal-image-component.html',
})
export class ModalImageComponent {
  // Estado del modal
  readonly isOpen = input.required<boolean>();

  // URL de la imagen y texto alternativo
  readonly imageUrl = input.required<string>();
  readonly altText = input<string>('Imagen sin Nombre');

  // Evento de cerrar
  readonly close = output<void>();
}
