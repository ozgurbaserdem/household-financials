// Utility function for safe array access
export const getSafeArrayElement = <T>(
  array: T[],
  index: number,
  fallback: T
): T => {
  return array && array.length > index ? array[index] : fallback;
};
