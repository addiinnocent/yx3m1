import { Component, OnInit, Input } from '@angular/core';

import { Customer } from '../../service/customer.service';

@Component({
  selector: 'app-adress-small',
  templateUrl: './adress-small.component.html',
  styleUrls: ['./adress-small.component.scss']
})
export class AdressSmallComponent implements OnInit {
  @Input() customer!: Customer | null;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
