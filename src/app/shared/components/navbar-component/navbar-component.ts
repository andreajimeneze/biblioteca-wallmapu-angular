import { NgOptimizedImage } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar-component',
  imports: [
    NgOptimizedImage,
],
  templateUrl: './navbar-component.html',
})
export class NavbarComponent {
  isScrolled = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }
}
