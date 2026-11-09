// Resource policy for draft.4 only, before any recursive schema validation.
export function exceedsContainerLimits(value: object): boolean {
  const pending = [{ value, depth: 1 }];
  let count = 0;

  while (pending.length > 0) {
    const current = pending.pop()!;

    count += 1;

    if (current.depth > 128 || count > 100_000) {
      return true;
    }

    for (const child of Object.values(current.value) as unknown[]) {
      if (typeof child === "object" && child !== null) {
        pending.push({ value: child, depth: current.depth + 1 });
      }
    }
  }

  return false;
}
