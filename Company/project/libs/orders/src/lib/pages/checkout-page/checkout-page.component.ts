/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {  takeUntil } from 'rxjs/operators';
import { UsersService } from '../../../../../users/src/lib/services/users.service';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
// import { ORDER_STATUS } from '../../order.constants';
import { StripeService } from 'ngx-stripe';

@Component({
  selector: 'orders-checkout-page',
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private stripeService: StripeService
  ) {}
 
  checkoutFormGroup: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] =[] ;
  userId : string;
  countries = [];
  unsubscribe$ :Subject<any> = new Subject();

  ngOnInit(): void {
    this._initCheckoutForm();
    this._autoFillUserData();
    this._getCartItems();
    this._getCountries();
  }
  
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private _initCheckoutForm() {
    this.checkoutFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required],
      street: ['', Validators.required]
    });
  }

  private _autoFillUserData(){
    this.usersService
    .observeCurrentUser()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((user) =>{
      if (user) {
        this.userId = user.id;
        this.checkoutForm.name.setValue(user.name);
        this.checkoutForm.email.setValue(user.email);
        this.checkoutForm.phone.setValue(user.phone);
        this.checkoutForm.city.setValue(user.city);
        this.checkoutForm.street.setValue(user.street);
        this.checkoutForm.country.setValue(user.country);
        this.checkoutForm.zip.setValue(user.zip);
       
      }
    });
  }

  private _getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((item) => {
      return {
        product: item.productId ,
        quantity: item.quantity,
      };
     
      
    });
    console.log(cart.items);
    console.log(this.orderItems);
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
  }

  backToCart() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    this.isSubmitted = true;
    console.log(this.isSubmitted);
    if (this.checkoutFormGroup.invalid) {
      return;
    }

    // this.ordersService.createCheckoutSession(this.orderItems).subscribe((session) =>{
    //   this.stripeService.redirectToCheckout({sessionId: session.id}).subscribe(error => {

    //   })
    // })

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.checkoutForm.street.value,
      city: this.checkoutForm.city.value,
      zip: this.checkoutForm.zip.value,
      country: this.checkoutForm.country.value,
      phone: this.checkoutForm.phone.value,
      status: 0,
      user: this.userId,
      dateOrdered: `${Date.now()}`
    };
    console.log(order);

    this.ordersService.createOrder(order).subscribe(
      () => {
        //redirect to thank you page // payment
        this.cartService.emptyCart();
        this.router.navigate(['/success']);
      }
    );
  }

  get checkoutForm() {
    return this.checkoutFormGroup.controls;
  }
}