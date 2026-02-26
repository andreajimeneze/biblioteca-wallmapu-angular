import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "@layouts/components/footer-component/footer-component";
import { ArrowUpComponent } from '@layouts/components/arrow-up-component/arrow-up-component';
import { NavbarComponent } from '@layouts/components/navbar-component/navbar-component';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NavbarComponent, 
    ArrowUpComponent, 
    FooterComponent,
  ],
  templateUrl: './layout.html',
})
export class Layout {

}
