import { TestBed } from '@angular/core/testing';

import { TeacherSessionService } from './teacher-session.service';

xdescribe('TeacherSessionService', () => {
  let service: TeacherSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
