import { Component, input, output } from '@angular/core';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-subject-selected-list-components',
  imports: [],
  templateUrl: './subject-selected-list-components.html',
})
export class SubjectSelectedListComponents {
  readonly subjectList = input<SubjectModel[]>();
  readonly onDelete = output<SubjectModel>();

  protected delete(item: SubjectModel, event: MouseEvent): void {
    event.preventDefault();   // evita submit del form si hay
    event.stopPropagation();  // evita que otros listeners en padres se disparen
    
    this.onDelete.emit(item);
  }
}