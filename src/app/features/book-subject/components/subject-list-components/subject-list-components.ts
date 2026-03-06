import { Component, input, output } from '@angular/core';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-subject-list-components',
  imports: [],
  templateUrl: './subject-list-components.html',
})
export class SubjectListComponents {
  readonly subjectList = input<SubjectModel[]>();
  readonly delete = output<SubjectModel>();

  protected onDelete(item: SubjectModel): void {
    this.delete.emit(item);
  }
}
