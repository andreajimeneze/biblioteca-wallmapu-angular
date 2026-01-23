import { Routes } from "@angular/router";
import { HomePage } from "@features/public/home/pages/home-page/home-page";
import { PalettePage } from "@features/public/home/pages/palette-page/palette-page";

export const  HOME_ROUTES: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'palette',
    component: PalettePage
  }
]