import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '@environments/environment';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private http = inject(HttpClient);
  protected apiUrl = environment.apiUrl;

  private cache = new Map<string, CacheEntry<unknown>>();
  protected readonly CACHE_TTL = 5 * 60 * 1000;

  private getCached<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
      return entry.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  protected get<T>(endpoint: string, useCache = false): Observable<T> {
    if (useCache) {
      const cached = this.getCached<T>(endpoint);
      if (cached) {
        return of(cached);
      }
    }

    return this.http.get<T>(`${this.apiUrl}/${endpoint}`).pipe(
      tap((data) => {
        if (useCache) {
          this.setCache(endpoint, data);
        }
      })
    );
  }

  protected getById<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  protected post<TResponse, TBody>(
    endpoint: string,
    body: TBody
  ): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.apiUrl}/${endpoint}`, body);
  }

  protected put<TResponse, TBody>(
    endpoint: string,
    id: string | number,
    body: TBody
  ): Observable<TResponse> {
    return this.http.put<TResponse>(
      `${this.apiUrl}/${endpoint}/${id}`,
      body
    );
  }

  protected delete<T>(endpoint: string, id: string | number): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`);
  }

  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}
