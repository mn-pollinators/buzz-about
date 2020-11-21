import { SentenceCasePipe } from './string-utils';

describe('The SentenceCasePipe class', () => {
  let pipe: SentenceCasePipe;

  beforeEach(() => {
    pipe = new SentenceCasePipe();
  });

  describe('Capitalizes the first letter of the string', () => {
    const testCases: [string, string][] = [
      ['', ''],
      ['a', 'A'],
      ['foo', 'Foo'],
      ['Foo', 'Foo'],
      ['foo Bar', 'Foo Bar'],
      ['like, zoinks, Scoob!', 'Like, zoinks, Scoob!'],
      ['narrow-leaved purple coneflower', 'Narrow-leaved purple coneflower'],
      ['123', '123'],
      ['ἑρμῆς', 'Ἑρμῆς'],
    ];
    for (const [input, expectedOutput] of testCases) {
      it(`…'${input}'`, () => {
        expect(pipe.transform(input)).toEqual(expectedOutput);
      });
    }
  });
});
