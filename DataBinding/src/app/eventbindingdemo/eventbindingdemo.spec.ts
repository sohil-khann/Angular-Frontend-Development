import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eventbindingdemo } from './eventbindingdemo';

describe('Eventbindingdemo', () => {
  let component: Eventbindingdemo;
  let fixture: ComponentFixture<Eventbindingdemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eventbindingdemo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Eventbindingdemo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
