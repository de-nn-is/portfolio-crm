interface SortIconProps<T> {
  field: T;
  currentField: T;
  direction: 'asc' | 'desc';
}

export function SortIcon<T>({ field, currentField, direction }: SortIconProps<T>) {
  if (currentField !== field) {
    return <span className="ml-1 text-gray-400">↕</span>;
  }
  return <span className="ml-1">{direction === 'asc' ? '↑' : '↓'}</span>;
}
