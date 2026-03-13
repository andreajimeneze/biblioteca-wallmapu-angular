import { Component } from '@angular/core';

@Component({
  selector: 'app-edition-copy-form-components',
  imports: [],
  templateUrl: './edition-copy-form-components.html',
})
export class EditionCopyFormComponents {

  protected formSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

  }
}
