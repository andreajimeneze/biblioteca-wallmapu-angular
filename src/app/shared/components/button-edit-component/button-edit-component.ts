import { Component, output } from '@angular/core';

@Component({
  selector: 'app-button-edit-component',
  imports: [],
  templateUrl: './button-edit-component.html',
})
export class ButtonEditComponent {
  protected readonly onClick = output<void>();
}
