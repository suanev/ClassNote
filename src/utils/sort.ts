export function sortByString<T>(items: T[], selector: (item: T) => string): T[] {
  return [...items].sort((left, right) => selector(left).localeCompare(selector(right)));
}
