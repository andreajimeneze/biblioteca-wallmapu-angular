import { Component } from '@angular/core';
import { PaletteComponent } from '@shared/components/palette-component/palette-component';
import { HeaderComponent } from "@shared/components/header-component/header-component";

@Component({
  selector: 'app-palette-page',
  imports: [
    PaletteComponent,
    HeaderComponent
],
  templateUrl: './palette-page.html',
})
export class PalettePage {

}
