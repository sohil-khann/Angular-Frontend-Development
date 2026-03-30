import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreHeader } from './store-header';

describe('StoreHeader', () => {
  let component: StoreHeader;
  let fixture: ComponentFixture<StoreHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
