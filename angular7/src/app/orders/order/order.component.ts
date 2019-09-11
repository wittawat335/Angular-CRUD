import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemComponent } from '../order-item/order-item.component';
import { Customer } from 'src/app/shared/customer.model';
import { CustomerService } from 'src/app/shared/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: []
})
export class OrderComponent implements OnInit {
  customerList: Customer[];
  isValid: boolean = true;

  constructor(private service: OrderService,
    private dialog:MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let orderId = this.currentRoute.snapshot.paramMap.get('id');
    if(orderId == null)
      this.resetForm();
    else{
      this.service.getOrderById(parseInt(orderId)).then(res => {
        this.service.formData = res.order;
        this.service.orderItems = res.orderDetails;
      });
    }

    this.customerService.getCustomerList().then(res => this.customerList = res as Customer[]);
  }
  resetForm(form?:NgForm){
    if (form = null)
      form.resetForm();
    this.service.formData = {
      OrderId: null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerId: 0,
      PMethod: '',
      GTotal: 0,
      DeletedOrderItemIds: ''
    };
    this.service.orderItems = [];
  }

  AddOrEditOrderItem(orderItemIndex, OrderID){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, OrderID };

    this.dialog.open(OrderItemComponent, dialogConfig).afterClosed().subscribe(res => { this.updateGrandTotal(); }); //ถ้าตอน click มี index เข้ามา จะทำการ biding
  }

  onDeleteOrderItem(OrderItemId: number, i: number){
      if (OrderItemId != null)
        this.service.formData.DeletedOrderItemIds += OrderItemId + ",";
      this.service.orderItems.splice(i,1);
      this.updateGrandTotal();
  
  }

  updateGrandTotal(){
    this.service.formData.GTotal = this.service.orderItems.reduce((prev, curr) => { return prev + curr.Total; }, 0);
    this.service.formData.GTotal = parseFloat(this.service.formData.GTotal.toFixed(2));
  }

  validateForm(){
    this.isValid = true;
    if(this.service.formData.CustomerId == 0){
      this.isValid = false;
    }    
    else if(this.service.orderItems.length == 0){
      this.isValid = false;
    }
    return this.isValid; 
  }

  onSubmit(form: NgForm){
    if(this.validateForm()){
      this.service.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success('บันทึกเรียบร้อย','');
        this.router.navigate(['/orders']);
      })
    }
  }

}
