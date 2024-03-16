export const joinBy = <Sep extends string>(sep: Sep) => (arr: unknown[]) => arr.join(sep);

export const join = joinBy("");

export const orEmptyString = (c: string|null|undefined) => c ?? '';
