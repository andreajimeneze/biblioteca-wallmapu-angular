import { Component } from '@angular/core';
import { ColorComponent } from '@shared/components/color-component/color-component';

@Component({
  selector: 'app-palette-page',
  imports: [
    ColorComponent
  ],
  templateUrl: './palette-page.html',
})
export class PalettePage {

}
