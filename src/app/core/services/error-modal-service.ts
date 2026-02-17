import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private _isOpen = signal(false);
  private _statusCode = signal<number | null>(null);
  private _message = signal<string>('');

  isOpen = this._isOpen.asReadonly();
  statusCode = this._statusCode.asReadonly();
  message = this._message.asReadonly();

  openError(status: number, message: string) {
    this._statusCode.set(status);
    this._message.set(message);
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }
}
