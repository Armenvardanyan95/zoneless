# **THIS IS EXPERIMENTAL**

## Purpose

This project aims to remove `zone.js` by using JavaScript [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and the Angular's new [`inject`](https://angular.io/api/core/inject) function to get the [`ChangeDetectorRef`](https://angular.io/api/core/ChangeDetectorRef) of the component and notify when properties are changed.

Thus, you can remove `zone.js` from your project and both improve the performance of your application and the bundle size.

## Usage

### Installation

Just install with `npm`:

```bash
npm install zoneless
```

### Import and use

```typescript
import { Component } from '@angular/core';
import { useState } from 'zoneless';

@Component({
    selector: 'app-root',
    template: `
        <h1>Zoneless</h1>
        <p>Counter: {{ state.counter }}</p>
        <button (click)="increment()">Increment</button>
    `,
    })
})
export class AppComponent {
    state = useState({
        counter: 0,
    });

    increment() {
        this.state.counter++; // everything works as usual
    }
}
```

### Changes you need top make to remove `zone.js`

First, you need to remove `zone.js` from your polyfills. Starting from Angular 15, polyfills are loaded using a property in `angular.json`:

```json
"projects": {
    "my-project": {
        "architect": {
            "build": {
                "options": {
                    "polyfills": [
                        "zone.js" // remove this line
                    ]
                }
            }
        }
    }
}
```

And disable using `ngZone` in `main.ts`:

```typescript
platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
```

That's it, now you have a zoneless application!

### Computed properties

You can also use computed properties, derived from an existing state:

```typescript

import { useState, computed } from 'zoneless';

@Component({
    selector: 'app-root',
    template: `
        <h1>Zoneless</h1>
        <p>Counter: {{ state.counter }}</p>
        <p>Counter * 2: {{ doubleCounter() }}</p>
        <button (click)="increment()">Increment</button>
    `,
    })
})
export class AppComponent {
    state = useState({
        counter: 0,
    });

    doubleCounter = computed(
        () => this.state.counter * 2,
        () => [this.state.counter],
    );

    increment() {
        this.state.counter++; // everything works as usual
    }
}
```

Notice two things: 

1. The `computed` function takes a function as the first argument, which is the function that will be called to get the value of the computed property.
2. Then it takes another function, which returns an array of dependencies. These are the properties that will be watched for changes. If any of them changes, the computed property will be recalculated.
3. It itself returns a function, so we need to call it in the template to get the value. This is to make Angular's change detection actually know the value has changed. The computing function will **not** if no dependencies have changed.
4. The dependency array actually let's us depenend on several other states

### Using `Observable`-s

`async` pipe might no longer work, but instead, you can use another function provided by the library, `useObservable`:

```typescript
import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { useObservable } from 'zoneless';

@Component({
    selector: 'app-root',
    template: `
        <h1>Zoneless</h1>
        <p>Timer: {{ state() }}</p>
    `,
    })
})
export class AppComponent {
    state = useObservable(interval(1_000));
}
```

So we no longer need the `async` pipe, but we can still use `Observable`-s.

> Note that the `useObservable` function returns a function, so you need to call it to get the value. This is to make Angular's change detection actually know the value has changed.

The `useObservable` function also automatically unsubscribes from the `Observable` when the component is destroyed.

## Known issues:

No issues have been reported as of now, but this is experimental, so use at your own risk.

## Contributing

Any contribution is welcome, be it a comment, and open issue, PR or anything else. As mentioned before, this is experimental, so any feedback is welcome. The aim is to experiment this further and see if it can be used in production.
