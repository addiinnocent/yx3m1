import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';

import { Shoppingcart, ShoppingcartService } from '../../service/shoppingcart.service';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  order!: Observable<Shoppingcart>;

  constructor(
    private route: ActivatedRoute,
    private shoppingcartService: ShoppingcartService,
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.order = this.shoppingcartService.getBill(id);
  }

}
