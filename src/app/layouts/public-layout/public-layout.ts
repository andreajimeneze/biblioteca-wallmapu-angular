import { Component } from '@angular/core';
import { ColorComponent } from '@shared/components/color-component/color-component';
import { FooterComponent } from '@shared/components/footer-component/footer-component';
import { NavbarComponent } from '@shared/components/navbar-component/navbar-component';

@Component({
  selector: 'app-public-layout',
  imports: [
    NavbarComponent,
    FooterComponent,
    ColorComponent
  ],
  templateUrl: './public-layout.html',
})
export class PublicLayout {

}
