import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { Observable } from 'rxjs';

export function useObservable<T>(source: Observable<T>) {
  let latestValue: T;
  const viewRef = inject(ChangeDetectorRef) as ViewRef;
  const subscription = source.subscribe((value) => {
    latestValue = value;
    viewRef.detectChanges();
  });

  queueMicrotask(() => {
    viewRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  });

  return () => latestValue;
}
