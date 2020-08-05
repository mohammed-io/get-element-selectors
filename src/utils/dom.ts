import { getShortestUniqueSubArrays } from './array';
import { escapeIdentifierIfNeeded } from './string';

export const isSelectorSettled = (selector: string, element: Element): boolean => {
  const isNthChildSelector = selector.startsWith(':');

  if (isNthChildSelector) {
    return false;
  }

  const matchingElements = document.querySelectorAll(selector)
  return matchingElements.length === 1 && matchingElements[0] === element;
};

export const getElementClassNames = (element: Element): string[] => {
  const classAttribute = element.getAttribute('class');
  if (!classAttribute) {
    // could be null or '' (es3)
    return [];
  }

  const isValidClassName = (classname: string) => {
    const pattern = new RegExp('^[_a-zA-Z]+[_a-zA-Z0-9-]*$');
    return pattern.test(classname);
  };

  return classAttribute.split(/\s+/g).filter(Boolean).filter(isValidClassName);
};

export const getElementAttributes = (element: Element, attrNames: string[]): string[] => {
  const res: string[] = [];

  attrNames.forEach((attr) => {
    const lowerName = attr.toLowerCase();
    const value = element.getAttribute(lowerName);

    if (element.hasAttribute(attr)) {
      if (value) {
        res.push(`[${lowerName}="${value}"]`);
      } else {
        res.push(`[${lowerName}]`);
      }
    }
  });

  return res;
};

export const getElementSiblings = (element: Element): Element[] => {
  const parent = element.parentNode;
  if (!parent || parent.nodeType === Node.DOCUMENT_NODE) {
    return [];
  }

  const siblings = [];
  let sibling = parent.firstChild;

  while (sibling) {
    if (sibling.nodeType === Node.ELEMENT_NODE && sibling !== element) {
      siblings.push(sibling as Element);
    }
    sibling = sibling.nextSibling;
  }

  return siblings;
};

export const getUniqueClassNamesAmongstSiblings = (element: Element): string[][] => {
  const siblings = getElementSiblings(element);
  const siblingClassNameArrays = siblings.map(getElementClassNames);
  const elementClassNames = getElementClassNames(element);

  return getShortestUniqueSubArrays(elementClassNames, siblingClassNameArrays);
};

export const getUniqueAttributesAmongstSiblings = (element: Element, attrNames: string[]): string[][] => {
  const siblings = getElementSiblings(element);
  const siblingAttributeArrays = siblings.map((i) => getElementAttributes(i, attrNames));
  const elementAttributes = getElementAttributes(element, attrNames);

  return getShortestUniqueSubArrays(elementAttributes, siblingAttributeArrays);
};

export const getElementSelectorById = (element: Element): string | null => {
  const id = element.getAttribute('id');
  return id ? `#${escapeIdentifierIfNeeded(id)}` : null;
};

export const getElementSelectorsByClassName = (element: Element): string[] => {
  const classnames = getUniqueClassNamesAmongstSiblings(element);

  return classnames.map((array) => array.map((name) => `.${escapeIdentifierIfNeeded(name)}`).join(''));
};

export const getElementSelectorsByAttributes = (element: Element, attrNames: string[]): string[] => {
  const attributes = getUniqueAttributesAmongstSiblings(element, attrNames);
  return attributes.map((arr) => arr.join(''));
};

export const getElementNthChild = (element: Element): number | null => {
  const parent = element.parentNode;
  if (!parent || parent.nodeType === Node.DOCUMENT_NODE) {
    return null;
  }

  let child = parent.firstChild;
  let index = 0;

  while (child) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      index++;
    }

    if (child === element) {
      break;
    }

    child = child.nextSibling;
  }

  return index;
};

export const getElementSelectorByNthChild = (element: Element): string | null => {
  const nth = getElementNthChild(element);

  if (nth) {
    return `:nth-child(${nth})`;
  }

  return null;
};

export const getElementLocalSelectors = (element: Element, attrNames: string[]): string[] => {
  const idSelector = getElementSelectorById(element);

  // Use id if available
  if (idSelector) {
    return [idSelector];
  }

  // class and attr selectors
  const classSelectors = getElementSelectorsByClassName(element);
  const attributeSelectors = getElementSelectorsByAttributes(element, attrNames);

  const combinedSelectors = classSelectors.concat(attributeSelectors);
  if (combinedSelectors.length > 0) {
    return combinedSelectors;
  }

  const nthChildSelector = getElementSelectorByNthChild(element);
  // Use nthChild if nothing else available
  if (nthChildSelector && combinedSelectors.length === 0) {
    return [nthChildSelector];
  }

  return [];
};
