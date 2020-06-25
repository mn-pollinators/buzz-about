import { TestBed } from '@angular/core/testing';

import { StudentSessionService } from './student-session.service';

describe('StudentSessionService', () => {
  let service: StudentSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
