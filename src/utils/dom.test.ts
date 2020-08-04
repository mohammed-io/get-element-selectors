import {
  getElementClassNames,
  getElementSiblings,
  getUniqueClassNamesAmongstSiblings,
  getElementAttributes,
  getUniqueAttributesAmongstSiblings,
  getElementNthChild,
  getElementSelectorByNthChild,
  getElementLocalSelectors,
} from './dom';

test('getElementClassNames', () => {
  document.body.innerHTML = `
        <div id="target1" class="foo bar"/>
        <div id="target2" class=" foo 123    bar"/>
        <div id="target3" class=" #@#$ foo 123    bar"/>
        <div id="target4" class=" #@#$ foo 123 -b a-b  bar"/>
        <div id="target5"/>
  `;

  expect(getElementClassNames(document.getElementById('target1')!)).toEqual(['foo', 'bar']);
  expect(getElementClassNames(document.getElementById('target2')!)).toEqual(['foo', 'bar']);
  expect(getElementClassNames(document.getElementById('target3')!)).toEqual(['foo', 'bar']);
  expect(getElementClassNames(document.getElementById('target4')!)).toEqual(['foo', 'a-b', 'bar']);
  expect(getElementClassNames(document.getElementById('target5')!)).toEqual([]);
});

test('getElementAttributes', () => {
  document.body.innerHTML = `
        <div id="target1" name="foo bar" ></div>
        <div id="target2"></div>
        <div id="target3" data-test></div>
        <div id="target4" name="foo" data-test="bar" ></div>
        <div id="target5" name data-test foo="bar" ></div>
  `;

  const getById = (id: string): string[] => {
    const ele = document.getElementById(id)!;
    return getElementAttributes(ele, ['name', 'data-test']);
  };

  expect(getById('target1')).toEqual(['[name="foo bar"]']);
  expect(getById('target2')).toEqual([]);
  expect(getById('target3')).toEqual(['[data-test]']);
  expect(getById('target4')).toEqual(['[name="foo"]', '[data-test="bar"]']);
  expect(getById('target5')).toEqual(['[name]', '[data-test]']);
});

test('getElementSiblings', () => {
  document.body.innerHTML = `
        <div>
            <div id="target1" >1</div>
            <div id="target2" >2</div>
            <div id="target3" >3</div>
        </div>
  `;

  const getSiblingIds = (id: string): string[] => {
    const ele = document.getElementById(id)!;
    const siblings = getElementSiblings(ele) || [];
    return siblings.map((i) => i.getAttribute('id') || '').filter(Boolean);
  };

  expect(getSiblingIds('target1')).toEqual(['target2', 'target3']);
  expect(getSiblingIds('target2')).toEqual(['target1', 'target3']);
  expect(getSiblingIds('target3')).toEqual(['target1', 'target2']);
});

test('getUniqueClassNamesAmongstSiblings', () => {
  document.body.innerHTML = `
        <div>
            <div id="target1" class="a b c" >1</div>
            <div id="target2" class="b c d">2</div>
            <div id="target3" class="a c d ">3</div>
        </div>
  `;

  const getResult = (id: string): string[][] => {
    const ele = document.getElementById(id)!;
    return getUniqueClassNamesAmongstSiblings(ele);
  };

  expect(getResult('target1')).toEqual([['a', 'b']]);
  expect(getResult('target2')).toEqual([['b', 'd']]);
  expect(getResult('target3')).toEqual([['a', 'd']]);
});

test('getUniqueAttributesAmongstSiblings', () => {
  document.body.innerHTML = `
        <div>
            <div id="target1" foo="a" bar="b" koo="c">1</div>
            <div id="target2" foo="b" bar="b" koo="c">2</div>
            <div id="target3" foo="a" bar="c" koo="d">3</div>            
            <div id="target4" foo bar="c" koo="d">3</div>            
        </div>
  `;

  const getResult = (id: string): string[][] => {
    const ele = document.getElementById(id)!;
    return getUniqueAttributesAmongstSiblings(ele, ['foo', 'bar', 'koo']);
  };

  expect(getResult('target1')).toEqual([
    ['[foo="a"]', '[bar="b"]'],
    ['[foo="a"]', '[koo="c"]'],
  ]);
  expect(getResult('target2')).toEqual([['[foo="b"]']]);
  expect(getResult('target3')).toEqual([
    ['[foo="a"]', '[bar="c"]'],
    ['[foo="a"]', '[koo="d"]'],
  ]);
  expect(getResult('target4')).toEqual([['[foo]']]);
});

test('getElementNthChild', () => {
  document.body.innerHTML = `
        <div>
            <div id="target1" foo="a" bar="b" koo="c">1</div>
            <div id="target2" foo="b" bar="b" koo="c">2</div>
            <div id="target3" foo="a" bar="c" koo="d">3</div>            
            <div id="target4" foo bar="c" koo="d">3</div>            
        </div>
  `;

  const getResult = (id: string): number | null => {
    const ele = document.getElementById(id);
    return getElementNthChild(ele!);
  };

  expect(getResult('target1')).toEqual(1);
  expect(getResult('target2')).toEqual(2);
  expect(getResult('target3')).toEqual(3);
  expect(getResult('target4')).toEqual(4);
});

test('getElementSelectorByNthChild', () => {
  document.body.innerHTML = `
        <div>
            <div id="target1" foo="a" bar="b" koo="c">1</div>
            <div id="target2" foo="b" bar="b" koo="c">2</div>
            <div id="target3" foo="a" bar="c" koo="d">3</div>            
            <div id="target4" foo bar="c" koo="d">3</div>            
        </div>
  `;

  const getResult = (id: string): string | null => {
    const ele = document.getElementById(id);
    return getElementSelectorByNthChild(ele!);
  };

  expect(getResult('target1')).toEqual(':nth-child(1)');
  expect(getResult('target2')).toEqual(':nth-child(2)');
  expect(getResult('target3')).toEqual(':nth-child(3)');
  expect(getResult('target4')).toEqual(':nth-child(4)');
});

test('getElementLocalSelectors', () => {
  document.body.innerHTML = `
        <div id="target">
            <div id="target0">1</div>
            <div class="a b c d" foo="a" bar="b" koo="c">1</div>
            <div class="a c" foo="a">1</div>            
        </div>
  `;
  const getResult = (index: number): string[] => {
    const ele = document.getElementById('target')!;
    return getElementLocalSelectors(ele.children[index], ['foo', 'bar', 'koo']);
  };

  expect(getResult(0)).toEqual(['#target0']);
  expect(getResult(1)).toEqual(['.b', '.d', '[bar="b"]', '[koo="c"]']);
  expect(getResult(2)).toEqual([':nth-child(3)']);
});
