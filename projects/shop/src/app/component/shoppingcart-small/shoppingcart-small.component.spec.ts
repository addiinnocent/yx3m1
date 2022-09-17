import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingcartSmallComponent } from './shoppingcart-small.component';

describe('ShoppingcartSmallComponent', () => {
  let component: ShoppingcartSmallComponent;
  let fixture: ComponentFixture<ShoppingcartSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingcartSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingcartSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
