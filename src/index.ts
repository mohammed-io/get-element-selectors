import { getElementLocalSelectors, isSelectorSettled } from './utils/dom';
import { getCombos } from './utils/array';

export type GetElementSelectorsOption = {
  attributes: string[];
  maxResults: number;
};

const getElementCompositeSelectors = (
  element: Element,
  option: GetElementSelectorsOption,
  prevSelectors: string[] | null,
): string[] => {
  const localSelectors = getElementLocalSelectors(element, option.attributes);
  const tagName = element.tagName.toLowerCase();
  const settledSelectors = [];

  for (let i = 0; i < localSelectors.length && settledSelectors.length < option.maxResults; i++) {
    const selector = localSelectors[i];
    const isClassOrAttributeSelector = selector.startsWith('.') || selector.startsWith('[');

    if (isSelectorSettled(selector, element)) {
      settledSelectors.push(selector);
    } else if (isClassOrAttributeSelector && isSelectorSettled(`${tagName}${selector}`, element)) {
      settledSelectors.push(`${tagName}${selector}`);
    }
  }

  if (settledSelectors.length > 0) {
    if (prevSelectors) {
      return getCombos(settledSelectors, prevSelectors)
        .map((i) => i.join(' > '))
        .slice(0, option.maxResults);
    } else {
      return settledSelectors;
    }
  }

  let currentSelectors = localSelectors.slice(0, option.maxResults);

  if (prevSelectors) {
    currentSelectors = getCombos(currentSelectors, prevSelectors)
      .map((i) => i.join(' > '))
      .slice(0, option.maxResults);
  }

  if (element.parentElement) {
    return getElementCompositeSelectors(element.parentElement, option, currentSelectors);
  }

  return [];
};

export const getElementSelectors = (
  element: Element,
  option: GetElementSelectorsOption = { attributes: ['type', 'name'], maxResults: 10 },
): string[] => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }
  return getElementCompositeSelectors(element, option, null);
};
