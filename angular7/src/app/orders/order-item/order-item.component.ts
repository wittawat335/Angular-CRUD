import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: []
})
export class OrderItemComponent implements OnInit {
  formData:OrderItem;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemComponent>) { }

  ngOnInit() {
    this.formData = {
      OrderItemID:null,
      OrderID:this.data.OrderID,
      ItemID:0,
      ItemName:'',
      Price:0,
      Quantity:0,
      Total:0
    }
  }

}
