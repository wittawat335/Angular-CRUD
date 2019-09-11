import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: []
})
export class OrdersComponent implements OnInit {
  orderList;

  constructor(private service:OrderService,
    private router: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.refreshList();
  }

  refreshList(){
    this.service.getOrderList().then(res => this.orderList = res);
  }

  openForEdit(orderId: number){
    this.router.navigate(['/order/edit/' + orderId]);
  }

  onOrderDelete(id: number){
    if(confirm('คุณต้องการลบใช่หรือไม่')){
      this.service.deleteOrder(id).then(res => {
        this.refreshList();
        this.toastr.warning("ลบเรียบร้อย", "Restaurent App.")
      });
    }
  }
}
