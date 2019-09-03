import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { OrderItem } from 'src/app/shared/order-item.model';
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';
import { from } from 'rxjs';
import { createHostListener } from '@angular/compiler/src/core';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: []
})
export class OrderItemComponent implements OnInit {
  formData: OrderItem;
  itemList: Item[];
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemComponent>,
    private itemService: ItemService,
    private orderService: OrderService) { }

  ngOnInit() {
    /*  api path */
    this.itemService.getItemList().then(res => this.itemList = res as Item[]);
    /*  api path */

    if(this.data.orderItemIndex == null) //เช็คจากหน้าแรกก็คือ Order ฟังก์ชั่น AddOrEditOrderItem ว่ามีการยิง index เข้ามาหรือไม่
    this.formData = {
      OrderItemID: null,
      OrderID: this.data.OrderID,
      ItemID: 0,
      ItemName: '',
      Price: 0,
      Quantity: 0,
      Total: 0
    }
    else
      this.formData = Object.assign({}, this.orderService.orderItems[this.data.orderItemIndex]);
  }

  updatePrice(ctrl) {
    if (ctrl.selectedIndex == 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    }
    else {
      this.formData.Price = this.itemList[ctrl.selectedIndex - 1].Price;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex - 1].Name;
    }
    this.updateTotal();
  }

  updateTotal() {
    this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }

  onSubmit(form: NgForm) {
    if(this.validateForm(form.value)){    
      if(this.data.orderItemIndex == null)
      this.orderService.orderItems.push(form.value);
      else
        this.orderService.orderItems[this.data.orderItemIndex] = form.value;
      this.dialogRef.close();
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.ItemID == 0){
      this.isValid = false;
    } 
    else if (formData.Quantity == 0){
      this.isValid = false;
    }
    return this.isValid;
  }
}
