import { TimePeriod, Month } from './time-period';

describe('TimePeriod', () => {
  describe('The fromIsoDate() method', () => {
    describe('When you pass in a valid input', () => {
      it('Correctly parses --01-01', () => {
        const timePeriod = TimePeriod.fromIsoDate('--01-01');
        expect(timePeriod.month).toEqual(Month.January);
        expect(timePeriod.quarter).toEqual(1);
      });

      it('Correctly parses --01-31', () => {
        const timePeriod = TimePeriod.fromIsoDate('--01-31');
        expect(timePeriod.month).toEqual(Month.January);
        expect(timePeriod.quarter).toEqual(4);
      });

      it('Correctly parses --06-10', () => {
        const timePeriod = TimePeriod.fromIsoDate('--06-10');
        expect(timePeriod.month).toEqual(Month.June);
        expect(timePeriod.quarter).toEqual(2);
      });

      it('Correctly parses --12-31', () => {
        const timePeriod = TimePeriod.fromIsoDate('--12-31');
        expect(timePeriod.month).toEqual(Month.December);
        expect(timePeriod.quarter).toEqual(4);
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
      const timePeriod = TimePeriod.fromMonthAndQuarter(Month.January, 1);
      expect(timePeriod.time).toEqual(0);
      expect(timePeriod.month).toEqual(Month.January);
      expect(timePeriod.quarter).toEqual(1);
      expect(timePeriod.monthString).toEqual('January');
    });

    it('Correctly creates the second quarter of March', () => {
      const timePeriod = TimePeriod.fromMonthAndQuarter(Month.March, 2);
      expect(timePeriod.time).toEqual(9);
      expect(timePeriod.month).toEqual(Month.March);
      expect(timePeriod.quarter).toEqual(2);
      expect(timePeriod.monthString).toEqual('March');
    });
  });

  describe('The next() method', () => {
    it('Correctly increments the initial time period', () => {
      const nextTimePeriod = TimePeriod.fromMonthAndQuarter(Month.January, 1).next();
      expect(nextTimePeriod.time).toEqual(1);
      expect(nextTimePeriod.month).toEqual(Month.January);
      expect(nextTimePeriod.quarter).toEqual(2);
      expect(nextTimePeriod.monthString).toEqual('January');
    });

    it('Correctly increments the last quarter of January', () => {
      const nextTimePeriod = TimePeriod.fromMonthAndQuarter(Month.January, 4).next();
      expect(nextTimePeriod.time).toEqual(4);
      expect(nextTimePeriod.month).toEqual(Month.February);
      expect(nextTimePeriod.quarter).toEqual(1);
      expect(nextTimePeriod.monthString).toEqual('February');
    });

    it('Correctly wraps the last quarter of December', () => {
      const nextTimePeriod = TimePeriod.fromMonthAndQuarter(Month.December, 4).next();
      expect(nextTimePeriod.time).toEqual(0);
      expect(nextTimePeriod.month).toEqual(Month.January);
      expect(nextTimePeriod.quarter).toEqual(1);
      expect(nextTimePeriod.monthString).toEqual('January');
    });
  });

  describe('The fallsBetween() method', () => {
    const trueCases = [
      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 3),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 2),
      },
      {
        start: TimePeriod.fromMonthAndQuarter(Month.February, 4),
        end: TimePeriod.fromMonthAndQuarter(Month.November, 4),
        moment: TimePeriod.fromMonthAndQuarter(Month.June, 1),
      },

      // Make sure that each endpoint is inclusive
      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 3),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 1),
      },
      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 3),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 3),
      },
      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 2),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 2),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 2),
      },


      // These are the cases that wrap around New Year's
      {
        start: TimePeriod.fromMonthAndQuarter(Month.October, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.March, 1),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 1),
      },
      {
        start: TimePeriod.fromMonthAndQuarter(Month.October, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.March, 1),
        moment: TimePeriod.fromMonthAndQuarter(Month.December, 1),
      },
      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 3),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 1),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 4),
      },
      {
        start: TimePeriod.fromMonthAndQuarter(Month.October, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.March, 1),
        moment: TimePeriod.fromMonthAndQuarter(Month.October, 1),
      },
      {
        start: TimePeriod.fromMonthAndQuarter(Month.October, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.March, 1),
        moment: TimePeriod.fromMonthAndQuarter(Month.March, 1),
      },
    ];

    const falseCases = [
      // between but not in order
      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 3),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 1),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 2),
      },

      // falls after
      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 1),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 3),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 4),
      },

      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 2),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 2),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 3),
      },

      {
        start: TimePeriod.fromMonthAndQuarter(Month.January, 2),
        end: TimePeriod.fromMonthAndQuarter(Month.January, 2),
        moment: TimePeriod.fromMonthAndQuarter(Month.January, 1),
      },
    ];

    for(const {start, end, moment} of trueCases) {
      it(`Accepts start: ${start.time} end: ${end.time} moment: ${moment.time}`, () => {
        expect(moment.fallsWithin(start, end)).toEqual(true);
      });
    }

    for(const {start, end, moment} of falseCases) {
      it(`Rejects start: ${start.time} end: ${end.time} moment: ${moment.time}`, () => {
        expect(moment.fallsWithin(start, end)).toEqual(false);
      });
    }

  });
});
