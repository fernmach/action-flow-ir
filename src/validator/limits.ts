// Pre-schema container policy for draft.4 and draft.5.
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

interface FlowShape {
  nodes: readonly unknown[];
  connections: readonly unknown[];
  inputs: readonly unknown[];
  outputs: readonly unknown[];
  locals: readonly unknown[];
}

export const DATA_FLOW_WORD_LIMIT = 5_000_000;

// Schema-success draft.5 accounting; the estimate is independent of processing order.
export function dataFlowWordUnits(document: {
  actions: readonly FlowShape[];
}): number {
  return document.actions.reduce((sum, action) => {
    const declarations =
      action.inputs.length + action.outputs.length + action.locals.length;

    return (
      sum +
      (action.nodes.length + action.connections.length) *
        Math.max(1, Math.ceil(declarations / 32))
    );
  }, 0);
}
