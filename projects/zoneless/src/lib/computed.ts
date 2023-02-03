export function computed<Result, Dependency extends any>(
  projector: () => Result,
  depsGetter: () => Dependency[]
): () => Result {
  let previousDeps: Dependency[] = [...depsGetter()];
  let result = projector();
  return () => {
    const deps = depsGetter();
    if (previousDeps.some((dep, index) => dep !== deps[index])) {
      result = projector();
      previousDeps = [...deps];
    }
    return result;
  };
}
