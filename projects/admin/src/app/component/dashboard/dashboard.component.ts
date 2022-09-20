import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesDataSource } from '../sales/sales-datasource';
import { CustomersDataSource } from '../customers/customers-datasource';

import { LogsDataSource } from '../logs/logs-datasource';
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
  typesOfLogs: any[] = [{
    name: 'admin',
    selected: true,
  }, {
    name: 'login',
    selected: true,
  }, {
    name: 'email',
    selected: true,
  }, {
    name: 'order',
    selected: true,
  }, {
    name: 'image',
    selected: true,
  }];

  categories: Category[] | undefined;
  logs!: LogsDataSource;
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
    this.logs = new LogsDataSource(logService);
    this.sales = new AdvancedPieChartDataSource(saleService);
    this.items = new PieChartDataSource(itemService);
    this.payments = new HorizontalBarChartDataSource(paymentService);
    this.customers = new LinearChartDataSource(customerService);
  }

  ngOnInit(): void {
    this.typesOfLogs.map((c: Category) => c.selected = true);
    this.logs.selectFields.next(this.typesOfLogs);

    this.categoryService.getCategories('', 0, 100, 'order', 'asc')
    .subscribe((categories) => {
      this.categories = categories;
      this.categories.map((c: Category) => c.selected = true)
      this.items.selectFields.next(this.categories);
    });
  }

  selectTypeOfLog(event: Event, type: any): void {
    type.selected = !type.selected;
    this.logs.selectFields
    .next(this.typesOfLogs!.filter((t:any) => t.selected == true));
    event.stopPropagation();
  }

  selectCategory(event: Event, category: Category): void {
    category.selected = !category.selected;
    this.items.selectFields
    .next(this.categories!.filter((c:any) => c.selected == true));
    event.stopPropagation();
  }

}
