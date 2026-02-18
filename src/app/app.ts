import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalErrorComponent } from "@shared/components/modal-error-component/modal-error-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ModalErrorComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('biblioteca-wallmapu');
}
