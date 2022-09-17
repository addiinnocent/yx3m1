import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesDataSource } from '../sales/sales-datasource';
import { CustomersDataSource } from '../customers/customers-datasource';

import { PieChartDataSource } from '../pie-chart/pie-chart-datasource';
import { AdvancedPieChartDataSource } from '../advanced-pie-chart/advanced-pie-chart-datasource';
import { LinearChartDataSource } from '../linear-chart/linear-chart-datasource';
import { HorizontalBarChartDataSource } from '../horizontal-bar-chart/horizontal-bar-chart-datasource';

import { Log, LogService } from '../../service/log.service';
import { Sale, SaleService } from '../../service/sale.service';
import { Item, ItemService } from '../../service/item.service';
import { Payment, PaymentService } from '../../service/payment.service';
import { Customer, CustomerService } from '../../service/customer.service';
import { Category, CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  typesOfLogs: string[] = ['admin', 'login', 'email', 'order', 'image'];
  logs: Observable<Log[]>;
  categories: Category[] | undefined;
  sales!: AdvancedPieChartDataSource;
  items!: PieChartDataSource;
  payments!: HorizontalBarChartDataSource;
  customers!: LinearChartDataSource;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private logService: LogService,
    private saleService: SaleService,
    private itemService: ItemService,
    private paymentService: PaymentService,
    private customerService: CustomerService,
    private categoryService: CategoryService,
  ) {
    this.logs = this.logService.getLogs(this.typesOfLogs);
    this.sales = new AdvancedPieChartDataSource(saleService);
    this.items = new PieChartDataSource(itemService);
    this.payments = new HorizontalBarChartDataSource(paymentService);
    this.customers = new LinearChartDataSource(customerService);
  }

  ngOnInit(): void {
    this.categoryService.getCategories('', 0, 100, 'order', 'asc')
    .subscribe((categories) => {
      this.categories = categories;
      this.categories.map((c: Category) => c.selected = true)
      this.items.selectFields.next(this.categories);
    });
  }

  selectCategory(event: Event, category: Category): void {
    category.selected = !category.selected;
    this.items.selectFields
    .next(this.categories!.filter((c:any) => c.selected == true));
    event.stopPropagation();
  }

}
