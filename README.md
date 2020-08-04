get-element-selectors
---

Returns an array of CSS selector strings for a given DOM element. 

### Usage

 `getElementSelectors(element, option)`

### Example

 

``` 
import { getElementSelectors } from 'get-element-selectors';

const option =  { attributes: ['name', 'type', 'data-foo'], maxResults: 10 }

const ele = document.querySelectorAll("div")[3];

const selectors = getElementSelectors(element, option);

console.log(selectors); // Output: ['.target', ...]

```

### Parameters

**element** 

This is the HTML Element.

**option** 

Option is an Object with the following fields:

1. `attributes` : This is an array containing attribute names can be used as selectors. Default is `['type', 'name']` .
2. `maxResults` : This sets the maximum number of selector strings will return

### Types

``` 
export type GetElementSelectorsOption = {
  attributes: string[];
  maxResults: number;
};

export const getElementSelectors = (
  element: Element,
  option: GetElementSelectorsOption = { attributes: ['type', 'name'], maxResults: 10 },
): string[]  

```

### Notes

1. If an element has an ID attribute, the id selector will be the only selector in the returned array.
2. Only valid class names will be used in CSS selectors.
