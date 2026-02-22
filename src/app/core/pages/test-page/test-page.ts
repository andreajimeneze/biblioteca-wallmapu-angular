import { Component, computed, inject } from '@angular/core';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { UserStatusSelectComponents } from "@features/user-status/components/user-status-select-components/user-status-select-components";
import { UserRoleSelectComponents } from "@features/user-role/components/user-role-select-components/user-role-select-components";
import { CommuneSelectComponents } from "@features/commune/components/commune-select-components/commune-select-components";
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { AuthStore } from '@features/auth/services/auth-store';
import { JsonPipe } from '@angular/common';
import { NewsService } from '@features/news/services/news-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserListRowComponent } from "@features/user/components/user-list-row-component/user-list-row-component";
import { NewsListRowComponent } from "@features/news/components/news-list-row-component/news-list-row-component";
import { NewsModel } from '@core/models/news-model';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';

@Component({
  selector: 'app-test-page',
  imports: [
    JsonPipe,
    MessageSuccessComponent,
    MessageErrorComponent,
    UserStatusSelectComponents,
    UserRoleSelectComponents,
    CommuneSelectComponents,
    AuthButtonComponent,
    LoadingComponent,
    SectionHeaderComponent,
    HeaderComponent,
    NewsListRowComponent
],
  templateUrl: './test-page.html',
})
export class TestPage {
  private readonly authService = inject(AuthStore)
  readonly user = this.authService.user

  private readonly newsService = inject(NewsService)
  
  private readonly dataResourceRX = rxResource({
    stream: () => {    
      return this.newsService.getAll(1,3,'').pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
  
          return response.result.result; 
        })
      );
    },
  });

  readonly isLoading = this.dataResourceRX.isLoading;

  readonly dataResourceComputed = computed<NewsWithImagesModel[] | null>(() => {
    const user = this.dataResourceRX.value();
  
    if (!user) return null;

    return user
  });
}
