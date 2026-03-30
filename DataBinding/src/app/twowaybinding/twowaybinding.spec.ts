import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Twowaybinding } from './twowaybinding';

describe('Twowaybinding', () => {
  let component: Twowaybinding;
  let fixture: ComponentFixture<Twowaybinding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Twowaybinding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Twowaybinding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
