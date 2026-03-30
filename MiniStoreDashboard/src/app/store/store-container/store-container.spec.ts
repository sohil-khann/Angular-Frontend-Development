import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreContainer } from './store-container';

describe('StoreContainer', () => {
  let component: StoreContainer;
  let fixture: ComponentFixture<StoreContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
