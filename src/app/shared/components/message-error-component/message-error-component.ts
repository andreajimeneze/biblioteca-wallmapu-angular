import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-error-component',
  imports: [],
  templateUrl: './message-error-component.html',
})
export class MessageErrorComponent {
  @Input() message: string = "Error";
}
