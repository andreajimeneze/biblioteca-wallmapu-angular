import { Component } from '@angular/core';

@Component({
  selector: 'app-signature-manual-components',
  imports: [],
  templateUrl: './signature-manual-components.html',
})
export class SignatureManualComponents {
  protected onClick(event: Event): void {
    event.preventDefault();
  }
}
