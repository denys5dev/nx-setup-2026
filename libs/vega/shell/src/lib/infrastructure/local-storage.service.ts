import { DOCUMENT, Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  readonly #document = inject(DOCUMENT);

  get(key: string): string | null {
    try {
      return this.#document.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      this.#document.defaultView?.localStorage.setItem(key, value);
    } catch {
      // Storage may be blocked; application state still works for this session.
    }
  }
}
