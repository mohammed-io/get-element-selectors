import { getElementSelectors } from './index';

test('getElementSelectors', () => {
  document.body.innerHTML = `
    <div id="target">
        <div id="target1" class="foo bar"></div>
        <div class=" foo 123    bar"> </div>
        <div class=" #@#$ foo 123    bar"> </div>
        <div class=" #@#$ foo 123   ko"> </div>
        <div name="hello">
          <p koo class=" #@#$ foo 123 -b a-b  bar"> d</p>
          <div foo bar class="你好" >d </div>
          <div foo="yes" class="no" > d</div>
          <div data-foo="好">d </div>
        </div>
    </div>
  `;

  const ele = document.getElementById('target')!;

  const getResult = (index: number, childIndex: number | undefined = undefined): string[] => {
    let element = ele.children[index];

    if (childIndex !== undefined) {
      element = element.children[childIndex];
    }

    return getElementSelectors(element, { attributes: ['name', 'type', 'bar', 'data-foo'], maxResults: 10 });
  };

  expect(getResult(0)).toEqual(['#target1']);
  expect(getResult(1)).toEqual(['#target > :nth-child(2)']);
  expect(getResult(2)).toEqual(['#target > :nth-child(3)']);
  expect(getResult(3)).toEqual(['.ko']);
  expect(getResult(4)).toEqual(['[name="hello"]']);
  expect(getResult(4, 0)).toEqual(['p.foo', '.a-b', 'p.bar']);
  expect(getResult(4, 1)).toEqual(['[bar]']);
  expect(getResult(4, 2)).toEqual(['.no']);
  expect(getResult(4, 3)).toEqual(['[data-foo="好"]']);
});
