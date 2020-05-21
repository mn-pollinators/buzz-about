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
      it('Rejects --00-01', () => {
        expect(() => {
          TimePeriod.fromIsoDate('--00-01');
        }).toThrow();
      });

      it('Rejects --13-01', () => {
        expect(() => {
          TimePeriod.fromIsoDate('--13-01');
        }).toThrow();
      });

      it('Rejects --01-00', () => {
        expect(() => {
          TimePeriod.fromIsoDate('--01-00');
        }).toThrow();
      });

      it('Rejects --13-32', () => {
        expect(() => {
          TimePeriod.fromIsoDate('--01-32');
        }).toThrow();
      });

      it('Rejects 1995-01-01', () => {
        expect(() => {
          TimePeriod.fromIsoDate('1995-01-01');
        }).toThrow();
      });

      it('Rejects HI EVERYBODY', () => {
        expect(() => {
          TimePeriod.fromIsoDate('HI EVERYBODY');
        }).toThrow();
      });

      it('Throws a TypeError', () => {
        try {
          TimePeriod.fromIsoDate('HI EVERYBODY');
        } catch (e) {
          expect(e instanceof TypeError).toBeTruthy();
        }
      });
    });
  });



  describe('The constructor creates the correct object', () => {
    it('Correctly creates the initial time period', () => {
      const timePeriod = new TimePeriod(0, 0);
      expect(timePeriod.time).toEqual(0);
      expect(timePeriod.month).toEqual(0);
      expect(timePeriod.quarter).toEqual(0);
      expect(timePeriod.monthString).toEqual('January');
    });

    it('Correctly creates a time period (2,1)', () => {
      const timePeriod = new TimePeriod(2, 1);
      expect(timePeriod.time).toEqual(9);
      expect(timePeriod.month).toEqual(2);
      expect(timePeriod.quarter).toEqual(1);
      expect(timePeriod.monthString).toEqual('March');
    });
  });

});
