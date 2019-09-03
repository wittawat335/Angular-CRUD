import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemComponent } from '../order-item/order-item.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private service: OrderService,
    private dialog:MatDialog) { }

  ngOnInit() {
    this.resetForm();
  }
  resetForm(form?:NgForm){
    if (form = null)
      form.resetForm();
    this.service.formData = {
      OrderID: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerID: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIDs: ''
    };
    this.service.orderItems = [];
  }

  AddOrEditOrderItem(orderItemIndex, OrderID){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, OrderID };

    this.dialog.open(OrderItemComponent, dialogConfig); //ถ้าตอน click มี index เข้ามา จะทำการ biding
  }

  onDeleteOrderItem(OrderItemID: number, i: number){
 
      this.service.orderItems.splice(i,1);
  
  }
}
