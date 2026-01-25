import { Component, computed, Input } from '@angular/core';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
})
export class HeaderComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() image: string = '/images/header.webp';

  backgroundImage = computed(() => `url(${this.image})`);
}
