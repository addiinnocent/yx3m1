import { Component, OnInit, Input } from '@angular/core';

import { Shoppingcart } from '../../service/shoppingcart.service';

@Component({
  selector: 'app-shoppingcart-small',
  templateUrl: './shoppingcart-small.component.html',
  styleUrls: ['./shoppingcart-small.component.scss']
})
export class ShoppingcartSmallComponent implements OnInit {
  @Input() shoppingcart!: Shoppingcart | null;

  constructor(
  ) {}

  ngOnInit(): void {
  }

}
