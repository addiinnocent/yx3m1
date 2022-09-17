import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressSmallComponent } from './adress-small.component';

describe('AdressSmallComponent', () => {
  let component: AdressSmallComponent;
  let fixture: ComponentFixture<AdressSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdressSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdressSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
