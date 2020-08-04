export const getSubArrays = <T>(arr: T[]): T[][] => {
  if (arr.length === 0) {
    return [];
  }

  if (arr.length === 1) {
    return [arr];
  } else {
    const subarr = getSubArrays(arr.slice(1));

    return [[arr[0]]].concat(
      subarr.map((e) => [arr[0]].concat(e)),
      subarr,
    );
  }
};

export const getOrderedSubArrays = <T>(arr: T[]): T[][] => {
  const subarr = getSubArrays(arr);
  const sortFunc = (a: T[], b: T[]) => a.length - b.length;

  return subarr.sort(sortFunc);
};

export const isArrayElementsUnique = <T>(target: T[], others: T[][]): boolean => {
  for (const other of others) {
    if (target.every((i: T) => other.indexOf(i) >= 0)) {
      return false;
    }
  }

  return true;
};

export const getShortestUniqueSubArrays = <T>(target: T[], others: T[][]): T[][] => {
  const subArrays = getOrderedSubArrays(target);
  const res = [];
  let shortestUniqueSubArrayLength: number | null = null;

  for (const subArray of subArrays) {
    const isUnique = isArrayElementsUnique(subArray, others);
    const isShort = shortestUniqueSubArrayLength === null || subArray.length === shortestUniqueSubArrayLength;

    if (isUnique && isShort) {
      shortestUniqueSubArrayLength = subArray.length;
      res.push(subArray);
    }
  }

  return res;
};

export const getCombos = <T>(arr1: T[], arr2: T[]): T[][] => {
  const combos = [];

  for (const a of arr1) {
    for (const b of arr2) {
      combos.push([a, b]);
    }
  }

  return combos;
};
