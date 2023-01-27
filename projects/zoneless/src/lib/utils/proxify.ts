import { isObject } from "./isObject";

// a function that turns an object with possibly nested properties into a proxy recursively, and accepts a second config object that receives the get and set methods
export function proxify<State extends Record<string, any>>(
  state: State,
  config?: { set?: (target: State, property: string, value: any) => boolean }
): State {
  return new Proxy(state, {
    set: config?.set,
    get(target, property: string) {
      return isObject(target[property])
        ? proxify(target[property], config)
        : target[property]; // just return the state property
    },
  });
}


