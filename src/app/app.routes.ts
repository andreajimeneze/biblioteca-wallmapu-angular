import { Routes } from '@angular/router';
import { PublicLayout } from '@layouts/public-layout/public-layout';
import { NotFoundPage } from '@shared/pages/not-found-page/not-found-page';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('@features/public/home/home.routes').then(m => m.HOME_ROUTES),
      }
    ]
  },
  {
    path: '**',
    component: NotFoundPage
  }
];
