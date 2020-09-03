import { TestBed } from '@angular/core/testing';

import { FirebaseService } from './firebase.service';

xdescribe('FirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseService = TestBed.inject(FirebaseService);
    expect(service).toBeTruthy();
  });
});
