import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';
import { ForbiddenPage } from '@core/pages/forbidden-page/forbidden-page';
import { NotFoundPage } from '@core/pages/not-found-page/not-found-page';
import { LayoutAdmin } from '@layouts/layout-admin/layout-admin';
import { LayoutUser } from '@layouts/layout-user/layout-user';
import { Layout } from '@layouts/layout/layout';
import { Role } from '@shared/constants/roles-enum';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadChildren: () => import('@features/home/home.routes').then(m => m.HOME_ROUTES),
      },
    ]
  },
  {
    path: 'admin',
    component: LayoutAdmin,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
    children: [
      {
        path: '',
        component: ForbiddenPage
      },
      {
        path: 'books',
        component: ForbiddenPage
      },
      {
        path: 'news',
        loadChildren: () => import('@features/news/news.routes').then(m => m.NEWS_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('@features/user/user.routes').then(m => m.USER_ROUTES)
      },
      {
        path: 'profile',
        loadChildren: () => import('@features/user/profile.route').then(m => m.PROFILE_ROUTES)
      },
      {
        path: 'settings',
        component: ForbiddenPage
      },      
    ]
  },
  {
    path: 'user',
    component: LayoutUser,
    canActivate: [authGuard],
    data: { roles: [Role.Reader]},
    children: [
      {
        path: 'profile',
        loadChildren: () => import('@features/user/profile.route').then(m => m.PROFILE_ROUTES)
      },
    ]
  },
  {
    path: 'forbidden',
    component: ForbiddenPage
  },
  {
    path: '**',
    component: NotFoundPage
  }
];
