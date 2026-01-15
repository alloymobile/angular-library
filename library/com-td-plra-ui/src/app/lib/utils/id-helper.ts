let idCounter = 0;

export function generateId(prefix = 'id'): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
