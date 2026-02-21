import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '@features/user/services/user-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { map } from 'rxjs';
import { UserListComponents } from "@features/user/components/user-list-components/user-list-components";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { UserDetailModel } from '@features/user/models/user-detail-model';

@Component({
  selector: 'app-user-list.page',
  imports: [
    SectionHeaderComponent,
    UserListComponents,
    MessageErrorComponent,
    PaginationComponent
],
  templateUrl: './user-list.page.html',
})
export class UserListPage {
  // SERVICIO DE FEATURE
  private readonly userService = inject(UserService);
  
  // TRIBUTOS
  readonly currentPage = signal(1);
  private readonly items = signal<number>(10);
  readonly search = signal('');
  readonly totalPages = signal<number>(0);

  private readonly params = computed(() => ({
    currentPage: this.currentPage(),
    items: this.items(),
    search: this.search(),
  })); 

  // FETCH
  private readonly dataResourceRX = rxResource({
    params: () => this.params(),
    stream: ({ params  }) => {    
      return this.userService
      .getAllDetails( 
        params.currentPage, 
        params.items, 
        params.search
      )
      .pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.totalPages.set(response.result.pages);
          return response.result;
        })
      );
    },
  });

  // ESPERA QUE FINALICE RX
  readonly isLoading = this.dataResourceRX.isLoading;

  // CONTROL DE ERROES
  readonly backendError = computed(() => this.dataResourceRX.error()?.message ?? null);
  
  // PROCESAR USER
  readonly userDetailComputed = computed<UserDetailModel[]>(() => {
    const users = this.dataResourceRX.value();
    if (!users) 
      return [];

      return users.result;
  });

  searchText(text: string) {
    this.search.set(text);
    this.currentPage.set(1); 
  }
  
  nextPage() {
    if (this.currentPage() < this.totalPages()){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }
}
