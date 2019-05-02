import { TestBed } from '@angular/core/testing';

import { CommonsvcService } from './commonsvc.service';

describe('CommonsvcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonsvcService = TestBed.get(CommonsvcService);
    expect(service).toBeTruthy();
  });
});
