import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth-guard';
import { ForbiddenPage } from '@core/pages/forbidden-page/forbidden-page';
import { NotFoundPage } from '@core/pages/not-found-page/not-found-page';
import { TestPage } from '@core/pages/test-page/test-page';
import { AdminLayout } from '@layouts/admin-layout/admin-layout';
import { PublicLayout } from '@layouts/public-layout/public-layout';
import { UserLayout } from '@layouts/user-layout/user-layout';
import { Role } from '@shared/constants/roles-enum';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('@features/public/home/home.routes').then(m => m.HOME_ROUTES),
      },
      {
        path: 'library',
        loadChildren: () => import('@features/public/library/library.routes').then(m => m.LIBRARY_ROUTES),
      },
      {
        path: 'news',
        loadChildren: () => import('@features/public/news/news.routes').then(m => m.NEWS_ROUTES),
      },
      {
        path: 'test',
        component: TestPage
      },
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    data: { roles: [Role.Admin]},
    children: [
      {
        path: '',
        loadChildren: () => import('@features/admin/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'books',
        loadChildren: () => import('@features/admin/book/book.routes').then(m => m.BOOK_ROUTES),
      },
      {
        path: 'news',
        //loadChildren: () => import('@features/admin/news/news.routes').then(m => m.NEWS_ROUTES),
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
        loadChildren: () => import('@features/news/news.routes').then(m => m.NEWS_ROUTES),
      },      
    ]
  },
  {
    path: 'user',
    component: UserLayout,
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
