import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: []
})
export class OrdersComponent implements OnInit {
  orderList;

  constructor(private service:OrderService,
    private router: Router) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList(){
    this.service.getOrderList().then(res => this.orderList = res);
  }

  openForEdit(orderId: number){
    this.router.navigate(['/order/edit/' + orderId]);
  }
}
