import { Component, effect, input, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { NewsModel } from '@core/models/news-model';

@Component({
  selector: 'app-news-form-component',
  imports: [
    MessageErrorComponent
],
  templateUrl: './news-form-component.html',
})
export class NewsFormComponent {
  // ─── IO
  readonly actionText = input<string>()
  readonly newsModel = input<NewsModel>();
  readonly formSubmit = output<NewsModel>();

  // ─── ESTADO
  readonly errorMessage = signal<string | null>(null);

  // ─── FORM DATA
  readonly formData = signal<Partial<NewsModel>>({});

  private readonly syncFormEffect = effect(() => {
    const news = this.newsModel();
    if (!news) return; 

    this.formData.set({
      title: news.title ?? '',
      subtitle: news.subtitle ?? '',
      body: news.body ?? '',
    });
  });

  protected updateTitle(value: string, input: HTMLInputElement) { 
    this.updateField('title', value, input); 
  }
  protected updateSubtitle(value: string, input: HTMLInputElement) { 
    this.updateField('subtitle', value, input); 
  }
  protected updateBody(value: string, input: HTMLTextAreaElement) {
    this.updateField('body', value, input); 
  }

  private updateField<K extends keyof NewsModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: value }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof NewsModel, value: string): string | null {
    switch (key){
      case 'title':
        if (value.length > 100) return null;
        return value;
      case 'subtitle':
        if (value.length > 256) return null;
        return value;     
      default:
        return value;
    }
  }

  // ─── SUBMIT
  protected onSubmit(event: Event): void {
    event.preventDefault();
  }

  // ─── IMAGE HANDLING
  protected onChangeImages(event: Event): void {
  
  }
}
