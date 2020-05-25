import { TimePeriod } from './time-period';

describe('TimePeriod', () => {
  describe('The fromIsoDate() method', () => {
    describe('When you pass in a valid input', () => {
      it('Correctly parses --01-01', () => {
        const timePeriod = TimePeriod.fromIsoDate('--01-01');
        expect(timePeriod.month).toEqual(0);
        expect(timePeriod.quarter).toEqual(0);
      });

      it('Correctly parses --01-31', () => {
        const timePeriod = TimePeriod.fromIsoDate('--01-31');
        expect(timePeriod.month).toEqual(0);
        expect(timePeriod.quarter).toEqual(3);
      });

      it('Correctly parses --06-10', () => {
        const timePeriod = TimePeriod.fromIsoDate('--06-10');
        expect(timePeriod.month).toEqual(5);
        expect(timePeriod.quarter).toEqual(1);
      });

      it('Correctly parses --12-31', () => {
        const timePeriod = TimePeriod.fromIsoDate('--12-31');
        expect(timePeriod.month).toEqual(11);
        expect(timePeriod.quarter).toEqual(3);
      });
    });

    describe('When you pass in an invalid input', () => {
      const invalidInputs = [
        '--00-01',
        '--13-01',
        '--01-00',
        '--01-32',
        '1995-01-01',
        'HI EVERYBODY',
      ];

      for (const invalidInput of invalidInputs) {
        it(`Rejects ${invalidInput}`, () => {
          expect(() => {
            TimePeriod.fromIsoDate(invalidInput);
          }).toThrow();
        });
      }

      it('Throws a TypeError', () => {
        try {
          TimePeriod.fromIsoDate('HI EVERYBODY');
        } catch (e) {
          expect(e instanceof TypeError).toBeTruthy();
        }
      });
    });
  });


  describe('The fromMonthAndQuarter() method', () => {
    it('Correctly creates the initial time period', () => {
      const timePeriod = TimePeriod.fromMonthAndQuarter(0, 0);
      expect(timePeriod.time).toEqual(0);
      expect(timePeriod.month).toEqual(0);
      expect(timePeriod.quarter).toEqual(0);
      expect(timePeriod.monthString).toEqual('January');
    });

    it('Correctly creates a time period (2,1)', () => {
      const timePeriod = TimePeriod.fromMonthAndQuarter(2, 1);
      expect(timePeriod.time).toEqual(9);
      expect(timePeriod.month).toEqual(2);
      expect(timePeriod.quarter).toEqual(1);
      expect(timePeriod.monthString).toEqual('March');
    });
  });

  describe('The next() method', () => {
    it('Correctly increments the initial time period', () => {
      const nextTimePeriod = TimePeriod.fromMonthAndQuarter(0, 0).next();
      expect(nextTimePeriod.time).toEqual(1);
      expect(nextTimePeriod.month).toEqual(0);
      expect(nextTimePeriod.quarter).toEqual(1);
      expect(nextTimePeriod.monthString).toEqual('January');
    });

    it('Correctly increments the last quarter of January', () => {
      const nextTimePeriod = TimePeriod.fromMonthAndQuarter(0, 3).next();
      expect(nextTimePeriod.time).toEqual(4);
      expect(nextTimePeriod.month).toEqual(1);
      expect(nextTimePeriod.quarter).toEqual(0);
      expect(nextTimePeriod.monthString).toEqual('February');
    });

    it('Correctly wraps the last quarter of December', () => {
      const nextTimePeriod = TimePeriod.fromMonthAndQuarter(11, 3).next();
      expect(nextTimePeriod.time).toEqual(0);
      expect(nextTimePeriod.month).toEqual(0);
      expect(nextTimePeriod.quarter).toEqual(0);
      expect(nextTimePeriod.monthString).toEqual('January');
    });
  });
});
