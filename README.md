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

## Known issues:

## Contributing

Any contribution is welcome, be it a comment, and open issue, PR or anything else. As mentioned before, this is experimental, so any feedback is welcome. The aim is to experiment this further and see if it can be used in production.