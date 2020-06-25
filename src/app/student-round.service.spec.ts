import { TestBed } from '@angular/core/testing';

import { StudentRoundService } from './student-round.service';

describe('StudentRoundService', () => {
  let service: StudentRoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentRoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
