import { ChangeDetectorRef, inject } from "@angular/core";
import { proxify } from "./utils/proxify";

export function useState<State extends Record<string, any>>(state: State): State {
  const cdRef = inject(ChangeDetectorRef);
  setTimeout(() => cdRef.detectChanges()); // detect the very first changes when the state initializes
  return proxify(state, {
    set: (target, property: string, value) => {
      (target as Record<string, any>)[property] = value; // change the state
      cdRef.detectChanges(); // manually trigger the change detection
      return true;
    },
  });
}

// {count: 0, multiplyBy2}